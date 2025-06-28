const Competencia = require('../models/Competencia');
const User = require('../models/User');
const Patinador = require('../models/Patinador');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');
const ExcelJS = require('exceljs');
const path = require('path');

exports.crearCompetencia = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, clubOrganizador } = req.body;

    const competencia = new Competencia({
      nombre,
      descripcion,
      fecha,
      clubOrganizador,
      creador: req.user.id,
      resultados: [],
      resultadosClub: [],
      listaBuenaFe: [],
      padronSeguros: []
    });

    await competencia.save();

    try {
      const users = await User.find();
      const linksBase = `${process.env.CLIENT_URL}/competencias/${competencia._id}/confirmar`;
      for (const u of users) {
        await sendEmail(
          u.email,
          'Nueva competencia',
          `<p>Se ha creado la competencia ${nombre} el ${new Date(fecha).toLocaleDateString()}.</p>
           <p>Confirma tu participación:</p>
           <a href="${linksBase}?respuesta=SI">Participar</a> | <a href="${linksBase}?respuesta=NO">No participar</a>`
        );
        await Notification.create({
          usuario: u._id,
          mensaje: `Se ha creado la competencia ${nombre} el ${new Date(fecha).toLocaleDateString()}.`,
          competencia: competencia._id
        });
      }
    } catch (e) {
      console.error('Error al enviar notificaciones:', e);
    }
    res.json({ msg: 'Competencia creada correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear competencia' });
  }
};

exports.agregarResultados = async (req, res) => {
  try {
    const { competenciaId, resultados } = req.body;

    if (!competenciaId || !Array.isArray(resultados)) {
      return res.status(400).json({ msg: 'Datos de competencia inválidos' });
    }

    const competencia = await Competencia.findById(competenciaId);
    if (!competencia) {
      return res.status(404).json({ msg: 'Competencia no encontrada' });
    }

    const parsedResultados = resultados
      .map(r => {
        const res = {
          ...r,
          posicion: Number(r.posicion),
          puntos: Number(r.puntos)
        };
        if (!res.patinador) {
          delete res.patinador;
        }
        return res;
      })
      .filter(r => !isNaN(r.posicion) && !isNaN(r.puntos));

    competencia.resultados = parsedResultados;

    // Calcular puntos por club incluyendo corredores externos
    const patinadoresIds = parsedResultados
      .filter(r => r.patinador)
      .map(r => r.patinador);
    const patinadores = await Patinador.find({ _id: { $in: patinadoresIds } });
    const acumulado = {};

    parsedResultados.forEach(res => {
      let club = 'General Rodriguez';
      if (res.patinador) {
        const pat = patinadores.find(p => p._id.toString() === res.patinador);
        club = pat?.club || 'General Rodriguez';
      } else if (res.club) {
        club = res.club;
      }

      const puntos = Number(res.puntos) || 0;
      acumulado[club] = (acumulado[club] || 0) + puntos;
    });

    competencia.resultadosClub = Object.entries(acumulado).map(([club, puntos]) => ({ club, puntos }));

    await competencia.save();

    res.json({ msg: 'Resultados cargados correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al cargar resultados' });
  }
};

exports.listarCompetencias = async (req, res) => {
  try {
    const competencias = await Competencia.find().sort({ fecha: -1 }).populate('resultados.patinador');
    res.json(competencias);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener competencias' });
  }
};

exports.agregarResultadosClub = async (req, res) => {
  try {
    const { competenciaId, resultadosClub } = req.body;

    const competencia = await Competencia.findById(competenciaId);
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    competencia.resultadosClub = resultadosClub;
    await competencia.save();

    res.json({ msg: 'Resultados de clubes cargados correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al cargar resultados de clubes' });
  }
};

exports.editarCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, fecha, clubOrganizador } = req.body;
    await Competencia.findByIdAndUpdate(id, { nombre, descripcion, fecha, clubOrganizador });
    res.json({ msg: 'Competencia actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al editar competencia' });
  }
};

exports.eliminarCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    await Competencia.findByIdAndDelete(id);
    res.json({ msg: 'Competencia eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar competencia' });
  }
};

exports.confirmarParticipacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;
    const competencia = await Competencia.findById(id).populate('creador');
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    const usuario = await User.findById(req.user.id);

    if (respuesta === 'SI') {
      if (!competencia.listaBuenaFe.includes(usuario._id)) {
        competencia.listaBuenaFe.push(usuario._id);
        await competencia.save();
      }
      return res.json({ msg: 'Participación confirmada' });
    }

    try {
      await sendEmail(
        competencia.creador.email,
        'Participación rechazada',
        `<p>${usuario.nombre} ${usuario.apellido} no participará en ${competencia.nombre}.</p>`
      );
      await Notification.create({
        usuario: competencia.creador._id,
        mensaje: `${usuario.nombre} ${usuario.apellido} no participará en ${competencia.nombre}.`,
        competencia: competencia._id
      });
    } catch (e) {
      console.error('Error al notificar al delegado', e);
    }
    res.json({ msg: 'Respuesta registrada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al confirmar participación' });
  }
};

exports.obtenerListaBuenaFe = async (req, res) => {
  try {
    const { id } = req.params;
    const competencia = await Competencia.findById(id).populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    });

    if (!competencia) {
      return res.status(404).json({ msg: 'Competencia no encontrada' });
    }

    const lista = [];

    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => {
        lista.push({
          _id: p._id,
          tipoSeguro: 'SA',
          numeroCorredor: p.numeroCorredor,
          apellido: p.apellido,
          primerNombre: p.primerNombre,
          segundoNombre: p.segundoNombre,
          categoria: p.categoria,
          club: p.club || 'General Rodriguez',
          fechaNacimiento: p.fechaNacimiento,
          dni: p.dni
        });
      });
    });

    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener lista de buena fe' });
  }
};

exports.exportarListaBuenaFeExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const competencia = await Competencia.findById(id).populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    });

    if (!competencia) {
      return res.status(404).json({ msg: 'Competencia no encontrada' });
    }

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('LBF');

    const logoPath = path.join(__dirname, '../public/images/logo_apm.png');
    const imageId = workbook.addImage({ filename: logoPath, extension: 'png' });
    ws.addImage(imageId, { tl: { col: 0, row: 0 }, ext: { width: 140, height: 80 } });

    const fullBorder = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    ws.mergeCells('B2', 'H2');
    ws.getCell('B2').value = 'ASOCIACIÓN PATINADORES METROPOLITANOS';
    ws.getCell('B2').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('B2').font = { size: 12, bold: true };

    ws.mergeCells('B3', 'H3');
    ws.getCell('B3').value = 'patinapm@gmail.com - patincarreraapm@gmail.com';
    ws.getCell('B3').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B4', 'H4');
    ws.getCell('B4').value = 'COMITÉ DE CARRERAS';
    ws.getCell('B4').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B5', 'H5');
    ws.getCell('B5').value = 'LISTA DE BUENA FE - ESCUELA-TRANSICION-INTERMEDIA';
    ws.getCell('B5').alignment = { vertical: 'middle', horizontal: 'center' };
    ws.getCell('B5').font = { bold: true };

    ws.mergeCells('B6', 'C6');
    ws.getCell('B6').value = 'Fecha de emisión de la lista:';
    ws.getCell('B6').font = { italic: true };
    ws.getCell('D6').value = new Date().toLocaleDateString('es-AR');

    const headers = ['N°', 'Apellido y Nombre', 'DNI', 'Club', 'Categoría', 'N° Deportista'];
    const startRow = 8;
    headers.forEach((text, i) => {
      const cell = ws.getCell(startRow, i + 2);
      cell.value = text;
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = fullBorder;
    });

    let rowPos = startRow + 1;
    let contador = 1;
    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => {
        const values = [
          contador++,
          `${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
          p.dni,
          p.club || 'General Rodriguez',
          p.categoria,
          p.numeroCorredor || '-'
        ];
        values.forEach((val, colIdx) => {
          const cell = ws.getCell(rowPos, colIdx + 2);
          cell.value = val;
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = fullBorder;
        });
        rowPos++;
      });
    });

    ws.columns.forEach(col => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, cell => {
        const len = cell.value ? cell.value.toString().length : 0;
        if (len > maxLength) maxLength = len;
      });
      col.width = maxLength + 2;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=lista_buena_fe.xlsx');
    res.send(buffer);
  } catch (err) {
    console.error('Error al generar Excel:', err);
    res.status(500).send('Error al generar Excel');
  }
};
