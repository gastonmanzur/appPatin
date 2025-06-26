const Competencia = require('../models/Competencia');
const User = require('../models/User');
const Patinador = require('../models/Patinador');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

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
      let club = 'Sin club';
      if (res.patinador) {
        const pat = patinadores.find(p => p._id.toString() === res.patinador);
        club = pat?.club || 'Sin club';
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

    const azul = '002060';
    const blanco = 'FFFFFF';
    const rojo = 'FF0000';

    ws.mergeCells('A1:H1');
    ws.getCell('A1').value = 'COMITÉ DE CARRERAS';
    ws.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: azul } };
    ws.getCell('A1').font = { color: { argb: blanco }, bold: true, size: 14 };
    ws.getCell('A1').alignment = { horizontal: 'center' };

    ws.mergeCells('A2:H2');
    ws.getCell('A2').value = 'LISTA DE BUENA FE     ESCUELA–TRANSICION–INTERMEDIAS–FEDERADOS–LIBRES';
    ws.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: azul } };
    ws.getCell('A2').font = { color: { argb: blanco }, bold: true };
    ws.getCell('A2').alignment = { horizontal: 'center' };

    ws.addRow(['FECHA DE EMISIÓN', '', 'EVENTO Y FECHA', '', '', 'ORGANIZADOR', '', '']);
    ws.addRow(['', '', competencia.nombre, '', '', '', '', '']);
    ws.getCell('E4').value = new Date(competencia.fecha).toLocaleDateString();
    ws.getCell('F4').value = competencia.clubOrganizador;

    const headerRow = ['#', 'Seguro', 'N° Patinador', 'Nombre Completo', 'Categoría', 'Club', 'Fecha Nac.', 'DNI'];
    ws.addRow(headerRow);

    let contador = 1;
    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => {
        ws.addRow([
          contador++,
          'SA',
          p.numeroCorredor || '-',
          `${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
          p.categoria,
          p.club || 'General Rodriguez',
          new Date(p.fechaNacimiento).toLocaleDateString(),
          p.dni
        ]);
      });
    });

    ws.addRow([]);
    ws.addRow(['MANZUR VANESA CAROLINA', 'TECN', '08/07/1989', 34543626]);
    ws.addRow(['MANZUR GASTON ALFREDO', 'DELEG', '14/12/1983', 30609550]);
    ws.addRow(['FIRMA', '', '', 'FIRMA']);
    ws.addRow(['SECRETARIO/A CLUB', '', '', 'PRESIDENTE/A CLUB']);
    ws.addRow([]);
    const nota1 = ws.addRow(['LAS PERSONAS DETALLADAS PRECEDENTEMENTE SE ENCUENTRAN APTAS FÍSICA Y']);
    const nota2 = ws.addRow(['PARA LA PRÁCTICA ACTIVA DE ESTE DEPORTE Y CUENTAN CON SEGURO CON PÓLIZA VIGENTE.']);
    nota1.font = { color: { argb: rojo }, bold: true };
    nota2.font = { color: { argb: rojo }, bold: true };

    ws.columns.forEach(col => (col.width = 20));
    ws.eachRow({ includeEmpty: false }, row => {
      row.eachCell(cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    const filePath = path.join(__dirname, '..', 'uploads', `lbf_${id}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'lista_buena_fe.xlsx', err => {
      if (!err) {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al exportar excel' });
  }
};
