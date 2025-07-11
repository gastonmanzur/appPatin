const Competencia = require('../models/Competencia');
const User = require('../models/User');
const Patinador = require('../models/Patinador');
const PatinadorExterno = require('../models/PatinadorExterno');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');
const Torneo = require('../models/Torneo');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const CATEGORY_ORDER = [
  'CHDE', 'CHVE', 'M7DE', 'M7VE', 'PDE', 'PVE',
  '6DE', '6VE', '5DE', '5VE', '4DE', '4VE',
  'JDE', 'JVE', 'MDE', 'MVE',
  'PDT', 'PVT', '6DT', '6VT', '5DT', '5VT',
  '4DT', '4VT', 'JDI', 'JVI', 'MDI', 'MVI',
  'PDF', 'PVF', '6DF', '6VF', '5DF', '5VF',
  '4DF', '4VF', 'JDF', 'JVF', 'MDF', 'MVF'
];

const getCategoryIndex = cat => {
  const idx = CATEGORY_ORDER.indexOf(cat);
  return idx === -1 ? CATEGORY_ORDER.length : idx;
};

const getCategoryGroup = cat => {
  const last = cat.slice(-1).toUpperCase();
  return last === 'T' || last === 'I' ? 'TI' : last;
};

exports.crearCompetencia = async (req, res) => {
  try {
    const { nombre, descripcion, fecha, clubOrganizador, torneo } = req.body;

    const competencia = new Competencia({
      nombre,
      descripcion,
      fecha,
      clubOrganizador,
      torneo,
      creador: req.user.id,
      resultados: [],
      resultadosClub: [],
      listaBuenaFe: [],
      padronSeguros: []
    });

    await competencia.save();

    let torneoData = null;
    if (torneo) {
      try {
        torneoData = await Torneo.findByIdAndUpdate(torneo, { $addToSet: { competencias: competencia._id } }, { new: true });
      } catch (e) {
        console.error('Error al asociar competencia al torneo:', e);
      }
    }

    const enviarNoti = !(torneoData && torneoData.tipo === 'Nacional');

    if (enviarNoti) {
      try {
        const users = await User.find();
        const linksBase = `${process.env.CLIENT_URL}/competencias/${competencia._id}/confirmar`;
        for (const u of users) {
          await sendEmail(
            u.email,
            'Nueva competencia',
            `<p>Se ha creado la competencia ${nombre} el ${new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}.</p>
             <p>Confirma tu participación:</p>
             <a href="${linksBase}?respuesta=SI">Participar</a> | <a href="${linksBase}?respuesta=NO">No participar</a>`
          );
          await Notification.create({
            usuario: u._id,
            mensaje: `Se ha creado la competencia ${nombre} el ${new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}.`,
            competencia: competencia._id
          });
        }
      } catch (e) {
        console.error('Error al enviar notificaciones:', e);
      }
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

    const parsedResultados = (
      await Promise.all(
        resultados.map(async r => {
          const res = {
            ...r,
            posicion: Number(r.posicion),
            puntos: Number(r.puntos)
          };
          if (res.numeroCorredor !== undefined && res.numeroCorredor !== null) {
            res.numeroCorredor = Number(res.numeroCorredor);
          }
          if (!res.patinador) {
            delete res.patinador;
            if (res.numeroCorredor && (!res.nombre || !res.club)) {
              const ext = await PatinadorExterno.findOne({
                numeroCorredor: res.numeroCorredor,
                categoria: res.categoria
              });
              if (ext) {
                if (!res.nombre) res.nombre = ext.nombre;
                if (!res.club) res.club = ext.club;
                if (!res.categoria) res.categoria = ext.categoria;
              }
            }
          }
          return res;
        })
      )
    ).filter(r => !isNaN(r.posicion) && !isNaN(r.puntos));

    // Agregar o actualizar resultados existentes
    const extOps = [];
    parsedResultados.forEach(res => {
      const key = res.patinador ? res.patinador.toString() : `${res.nombre}-${res.club}`;
      const idx = competencia.resultados.findIndex(r => {
        if (res.patinador) {
          return r.patinador && r.patinador.toString() === res.patinador.toString();
        }
        return !r.patinador && r.nombre === res.nombre && r.club === res.club;
      });

      if (idx !== -1) {
        competencia.resultados[idx] = {
          ...competencia.resultados[idx]._doc,
          ...res
        };
      } else {
        competencia.resultados.push(res);
      }

      if (!res.patinador && res.numeroCorredor && res.nombre) {
        extOps.push(
          PatinadorExterno.findOneAndUpdate(
            { numeroCorredor: res.numeroCorredor, categoria: res.categoria },
            { nombre: res.nombre, club: res.club, categoria: res.categoria },
            { upsert: true, new: true }
          )
        );
      }
    });
    await Promise.all(extOps);

    // Calcular puntos por club incluyendo corredores externos
    const patinadoresIds = competencia.resultados
      .filter(r => r.patinador)
      .map(r => r.patinador);
    const patinadores = await Patinador.find({ _id: { $in: patinadoresIds } });
    const acumulado = {};

    competencia.resultados.forEach(res => {
      let club = 'General Rodriguez';
      if (res.patinador) {
        const pat = patinadores.find(p => p._id.toString() === res.patinador.toString());
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
    const competencia = await Competencia.findById(id)
      .populate({ path: 'listaBuenaFe', populate: { path: 'patinadoresAsociados' } })
      .populate('creador');
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    const usuario = await User.findById(req.user.id).populate('patinadoresAsociados');

    if (respuesta === 'SI') {
      // Build a set of already confirmed patinador DNIs
      const dnis = new Set();
      competencia.listaBuenaFe.forEach(u =>
        u.patinadoresAsociados.forEach(p => dnis.add(p.dni))
      );

      const nuevos = usuario.patinadoresAsociados.filter(p => !dnis.has(p.dni));

      if (nuevos.length === 0) {
        return res.json({ msg: 'Patinador ya confirmado por otro usuario' });
      }

      if (!competencia.listaBuenaFe.some(u => u._id.toString() === usuario._id.toString())) {
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
  const competencia = await Competencia.findById(id)
    .populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    })
    .populate('listaBuenaFeManual.patinador');

    if (!competencia) {
      return res.status(404).json({ msg: 'Competencia no encontrada' });
    }

    const mapa = new Map();

    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => {
        if (!mapa.has(p.dni)) {
          mapa.set(p.dni, {
            _id: p._id,
            tipoSeguro: 'SA',
            numeroCorredor: p.numeroCorredor,
            apellido: p.apellido,
            primerNombre: p.primerNombre,
            segundoNombre: p.segundoNombre,
            categoria: p.categoria,
            club: p.club || 'General Rodriguez',
            fechaNacimiento: p.fechaNacimiento,
            dni: p.dni,
            baja: competencia.bajas.some(b => b.toString() === p._id.toString())
          });
        }
      });
    });

    competencia.listaBuenaFeManual.forEach(e => {
      const p = e.patinador;
      if (p && !mapa.has(p.dni)) {
        mapa.set(p.dni, {
          _id: p._id,
          tipoSeguro: 'SA',
          numeroCorredor: p.numeroCorredor,
          apellido: p.apellido,
          primerNombre: p.primerNombre,
          segundoNombre: p.segundoNombre,
          categoria: p.categoria,
          club: p.club || 'General Rodriguez',
          fechaNacimiento: p.fechaNacimiento,
          dni: p.dni,
          baja: e.baja
        });
      }
    });

    const lista = Array.from(mapa.values());

    lista.sort((a, b) => getCategoryIndex(a.categoria) - getCategoryIndex(b.categoria));

    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener lista de buena fe' });
  }
};

exports.exportarListaBuenaFeExcel = async (req, res) => {
  try {
    const { id } = req.params;
  const competencia = await Competencia.findById(id)
    .populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    })
    .populate('listaBuenaFeManual.patinador');

    if (!competencia) {
      return res.status(404).json({ msg: 'Competencia no encontrada' });
    }

    const workbook = new ExcelJS.Workbook();
    const ws = workbook.addWorksheet('LBF');

    // Definir anchos de las columnas según especificación de Lista de Buena Fe
    ws.getColumn(1).width = 1.89;
    ws.getColumn(2).width = 10.22;
    ws.getColumn(3).width = 7.56;
    ws.getColumn(4).width = 38;
    ws.getColumn(5).width = 10.33;
    ws.getColumn(6).width = 13.22;
    ws.getColumn(7).width = 11.56;
    ws.getColumn(8).width = 11.33;

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
    ws.getCell('D6').value = new Date().toLocaleDateString('es-AR', { timeZone: 'UTC' });
    ws.getCell('D6').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B7:C7');
    ws.getCell('B7').value = 'EVENTO Y FECHA';
    ws.getCell('B7').font = { name: 'Calibri', size: 11, bold: true };
    ws.mergeCells('D7:H7');
    ws.getCell('D7').value = `${competencia.nombre} - ${new Date(competencia.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}`;
    ws.getCell('D7').alignment = { vertical: 'middle', horizontal: 'center' };

    ws.mergeCells('B8:C8');
    ws.getCell('B8').value = 'OGANIZADOR';
    ws.getCell('B8').font = { name: 'Calibri', size: 11, bold: true };
    ws.mergeCells('D8:H8');
    ws.getCell('D8').value = competencia.clubOrganizador;
    ws.getCell('D8').alignment = { vertical: 'middle', horizontal: 'center' };

    for (let r = 2; r <= 8; r++) {
      for (let c = 1; c <= 8; c++) {
        ws.getRow(r).getCell(c).border = fullBorder;
      }
    }

    let rowPos = 9;
    let contador = 1;
    let lastCat = null;

    const mapaPat = new Map();
    competencia.listaBuenaFe.forEach(u => {
      u.patinadoresAsociados.forEach(p => {
        if (!mapaPat.has(p.dni)) {
          mapaPat.set(p.dni, {
            patinador: p,
            baja: competencia.bajas.some(b => b.toString() === p._id.toString())
          });
        }
      });
    });
    competencia.listaBuenaFeManual.forEach(e => {
      if (e.patinador && !mapaPat.has(e.patinador.dni)) {
        mapaPat.set(e.patinador.dni, { patinador: e.patinador, baja: e.baja });
      }
    });

    const patinadores = Array.from(mapaPat.values());

    patinadores.sort(
      (a, b) =>
        getCategoryIndex(a.patinador.categoria) - getCategoryIndex(b.patinador.categoria)
    );

    patinadores.forEach(d => {
      const p = d.patinador;
      if (lastCat && getCategoryGroup(p.categoria) !== getCategoryGroup(lastCat)) {
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
        new Date(p.fechaNacimiento).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
        p.dni
      ];
      values.forEach((val, idx) => {
        const cell = row.getCell(idx + 1);
        cell.value = val;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = fullBorder;
        if (d.baja) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0000' } };
        }
      });
      lastCat = p.categoria;
    });

    // Separator after the last skater
    const endRow = ws.getRow(rowPos++);
    for (let c = 1; c <= 8; c++) {
      const cell = endRow.getCell(c);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '000000' } };
      cell.border = fullBorder;
    }

    // Leave two empty rows
    rowPos += 2;

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
      row.eachCell({ includeEmpty: true }, (cell, col) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (col > 3) {
          cell.border = fullBorder;
        }
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
      if (!col.width) col.width = 15;
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

exports.agregarPatinadorManual = async (req, res) => {
  try {
    const { id } = req.params;
    const { patinadorId } = req.body;

    const competencia = await Competencia.findById(id);
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    const existeEnLista = competencia.listaBuenaFeManual.find(e => e.patinador.toString() === patinadorId);
    if (existeEnLista) return res.status(400).json({ msg: 'Patinador ya agregado' });

    const todos = [];
    const compPop = await Competencia.findById(id).populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    });
    compPop.listaBuenaFe.forEach(u => u.patinadoresAsociados.forEach(p => todos.push(p._id.toString())));
    if (todos.includes(patinadorId)) return res.status(400).json({ msg: 'Patinador ya agregado' });

    competencia.listaBuenaFeManual.push({ patinador: patinadorId, baja: false });
    await competencia.save();
    res.json({ msg: 'Patinador agregado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al agregar patinador' });
  }
};

exports.actualizarBajaPatinadorManual = async (req, res) => {
  try {
    const { id, patinadorId } = req.params;
    const { baja } = req.body;

    const competencia = await Competencia.findById(id).populate({
      path: 'listaBuenaFe',
      populate: { path: 'patinadoresAsociados' }
    });
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    const entry = competencia.listaBuenaFeManual.find(e => e.patinador.toString() === patinadorId);

    if (entry) {
      entry.baja = baja;
    } else {
      const existe = competencia.listaBuenaFe.some(u =>
        u.patinadoresAsociados.some(p => p._id.toString() === patinadorId)
      );
      if (!existe) return res.status(404).json({ msg: 'Patinador no encontrado en lista' });

      const idx = competencia.bajas.findIndex(b => b.toString() === patinadorId);
      if (baja && idx === -1) {
        competencia.bajas.push(patinadorId);
      } else if (!baja && idx !== -1) {
        competencia.bajas.splice(idx, 1);
      }
    }

    await competencia.save();
    res.json({ msg: 'Estado actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar' });
  }
};
