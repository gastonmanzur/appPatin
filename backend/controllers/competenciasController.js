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

    ws.getRow(2).height = 21.8;
    ws.getRow(4).height = 22.2;

    const logoPath = path.join(__dirname, '../public/images/logo_apm.png');
    if (fs.existsSync(logoPath)) {
      const imageId = workbook.addImage({ filename: logoPath, extension: 'png' });
      ws.addImage(imageId, { tl: { col: 1, row: 1 }, br: { col: 3, row: 5 } });
    }

    const darkBlue = '003366';
    const fullBorder = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } }
    };

    ws.mergeCells('D2:H2');
    const cD2 = ws.getCell('D2');
    cD2.value = 'ASOCIACIÓN PATINADORES METROPOLITANOS';
    cD2.alignment = { vertical: 'middle', horizontal: 'center' };
    cD2.font = { name: 'Verdana', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    cD2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkBlue } };

    ws.mergeCells('D3:H3');
    const cD3 = ws.getCell('D3');
    cD3.value = 'patinapm@gmail.com - patincarreraapm@gmail.com - lbfpatincarrera@gmail.com';
    cD3.alignment = { vertical: 'middle', horizontal: 'center' };
    cD3.font = { name: 'Arial', size: 10, color: { argb: darkBlue } };
    cD3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } };

    ws.mergeCells('D4:H4');
    const cD4 = ws.getCell('D4');
    cD4.value = 'COMITÉ DE CARRERAS';
    cD4.alignment = { vertical: 'middle', horizontal: 'center' };
    cD4.font = { name: 'Franklin Gothic Medium', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    cD4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkBlue } };

    ws.mergeCells('D5:H5');
    const cD5 = ws.getCell('D5');
    cD5.value = 'LISTA DE BUENA FE  ESCUELA-TRANSICION-INTERMEDIA-FEDERADOS-LIBRES';
    cD5.alignment = { vertical: 'middle', horizontal: 'center' };
    cD5.font = { name: 'Lucida Console', size: 10, bold: true, color: { argb: 'FFFFFF' } };
    cD5.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkBlue } };

    ws.mergeCells('B6:C6');
    ws.getCell('B6').value = 'FECHA DE EMISION';
    ws.getCell('B6').font = { name: 'Calibri', size: 11, bold: true };
    ws.mergeCells('D6:H6');
    ws.getCell('D6').value = new Date().toLocaleDateString('es-AR');
    ws.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B7:C7');
    ws.getCell('B7').value = 'EVENTO Y FECHA';
    ws.getCell('B7').font = { name: 'Calibri', size: 11, bold: true };
    ws.mergeCells('D7:H7');
    ws.getCell('D7').value = `${competencia.nombre} - ${new Date(competencia.fecha).toLocaleDateString('es-AR')}`;
    ws.getCell('D7').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B8:C8');
    ws.getCell('B8').value = 'OGANIZADOR';
    ws.getCell('B8').font = { name: 'Calibri', size: 11, bold: true };
    ws.mergeCells('D8:H8');
    ws.getCell('D8').value = competencia.clubOrganizador;
    ws.getCell('D8').alignment = { vertical: 'middle', horizontal: 'center' };

    let rowPos = 9;
    let contador = 1;
    let lastCat = null;

    const patinadores = [];
    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => patinadores.push(p));
    });

    patinadores.forEach(p => {
      if (lastCat && p.categoria !== lastCat) {
        const br = ws.getRow(rowPos++);
        for (let c = 1; c <= 8; c++) {
          const cell = br.getCell(c);
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
          cell.border = fullBorder;
        }
      }

      const row = ws.getRow(rowPos++);
      const values = [
        contador++,
        'SA',
        p.numeroCorredor || '',
        `${p.apellido} ${p.primerNombre} ${p.segundoNombre || ''}`.trim(),
        p.categoria,
        'Gral. Rodriguez',
        new Date(p.fechaNacimiento).toLocaleDateString('es-AR'),
        p.dni
      ];
      values.forEach((val, idx) => {
        const cell = row.getCell(idx + 1);
        cell.value = val;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = fullBorder;
      });
      lastCat = p.categoria;
    });

    const tecnicos = [
      ['MANZUR VANESA CAROLINA', 'TECN', '08/07/1989', '34543626'],
      ['MANZUR GASTON ALFREDO', 'DELEG', '14/12/1983', '30609550'],
      ['CURA VANESA ELIZABEHT', 'DELEG', '24/02/1982', '29301868']
    ];

    tecnicos.forEach(d => {
      const row = ws.getRow(rowPos++);
      row.getCell(4).value = d[0];
      row.getCell(5).value = d[1];
      row.getCell(7).value = d[2];
      row.getCell(8).value = d[3];
      row.eachCell({ includeEmpty: true }, cell => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = fullBorder;
      });
    });

    rowPos++;
    ws.getCell(`C${rowPos}`).value = 'FIRMA';
    ws.getCell(`G${rowPos}`).value = 'FIRMA';
    ws.getRow(rowPos).eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = fullBorder;
    });

    rowPos++;
    ws.mergeCells(`B${rowPos}:C${rowPos}`);
    ws.getCell(`B${rowPos}`).value = 'SECRETARIO/A CLUB';
    ws.mergeCells(`F${rowPos}:G${rowPos}`);
    ws.getCell(`F${rowPos}`).value = 'PRESIDENTE CLUB';
    ws.getRow(rowPos).eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = fullBorder;
    });

    rowPos += 2;
    ws.getCell(`B${rowPos}`).value =
      'CERTIFICACION MEDICA: CERTIFICO QUE LAS PERSONAS DETALLADAS PRECEDENTEMENTE SE ENCUENTRAN APTAS FISICA Y';
    ws.getCell(`B${rowPos}`).font = { color: { argb: 'FF0000' } };
    ws.getRow(rowPos).eachCell(cell => {
      cell.border = fullBorder;
    });

    ws.getCell(`B${rowPos + 1}`).value =
      'PSIQUICAMENTE, PARA LA PRACTICA ACTIVA DE ESTE DEPORTE Y CUENTAN CON SEGURO CON POLIZA VIGENTE.';
    ws.getCell(`B${rowPos + 1}`).font = { color: { argb: 'FF0000' } };
    ws.getRow(rowPos + 1).eachCell(cell => {
      cell.border = fullBorder;
    });

    ws.columns.forEach(col => {
      if (!col.width || col.width < 15) col.width = 15;
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
