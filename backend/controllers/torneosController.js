const Torneo = require('../models/Torneo');
const Competencia = require('../models/Competencia');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

exports.crearTorneo = async (req, res) => {
  try {
    const { nombre, descripcion, fechaInicio, fechaFin, tipo } = req.body;
    const torneo = new Torneo({
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      tipo,
      creador: req.user.id,
      competencias: []
    });
    await torneo.save();

    if (tipo === 'Nacional') {
      try {
        const users = await User.find();
        const linksBase = `${process.env.CLIENT_URL}/torneos/${torneo._id}/confirmar`;
        for (const u of users) {
          await sendEmail(
            u.email,
            'Nuevo torneo nacional',
            `<p>Se ha creado el torneo nacional ${nombre}.</p>
             <p>Confirma tu participación:</p>
             <a href="${linksBase}?respuesta=SI">Participar</a> | <a href="${linksBase}?respuesta=NO">No participar</a>`
          );
          await Notification.create({
            usuario: u._id,
            mensaje: `Se ha creado el torneo nacional ${nombre}.`,
            torneo: torneo._id
          });
        }
      } catch (e) {
        console.error('Error al enviar notificaciones de torneo:', e);
      }
    }

    res.json({ msg: 'Torneo creado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear torneo' });
  }
};

exports.listarTorneos = async (req, res) => {
  try {
    const torneos = await Torneo.find().populate('competencias');
    res.json(torneos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener torneos' });
  }
};

exports.getRankingTorneo = async (req, res) => {
  try {
    const { id } = req.params;
    const competencias = await Competencia.find({ torneo: id }).populate('resultados.patinador');
    const acumulado = {};
    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
        const club = res.patinador ? (res.patinador.club || 'General Rodriguez') : (res.club || 'General Rodriguez');
        const puntos = Number(res.puntos) || 0;
        acumulado[club] = (acumulado[club] || 0) + puntos;
      });
    });
    const ranking = Object.entries(acumulado)
      .map(([club, puntos]) => ({ club, puntos }))
      .sort((a, b) => b.puntos - a.puntos);
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking del torneo' });
  }
};

exports.getRankingCategoriasTorneo = async (req, res) => {
  try {
    const { id } = req.params;
    const competencias = await Competencia.find({ torneo: id }).populate('resultados.patinador');
    const acumulado = {};
    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
        const categoria = res.patinador ? res.patinador.categoria : res.categoria;
        const key = res.patinador ? res.patinador._id.toString() : `${res.nombre}-${res.club}`;
        if (!acumulado[categoria]) acumulado[categoria] = {};
        if (!acumulado[categoria][key]) {
          acumulado[categoria][key] = res.patinador
            ? { patinador: res.patinador, club: res.patinador.club, puntos: 0 }
            : { nombre: res.nombre, club: res.club, puntos: 0 };
        }
        acumulado[categoria][key].puntos += res.puntos;
      });
    });
    const rankingPorCategoria = {};
    for (const categoria in acumulado) {
      rankingPorCategoria[categoria] = Object.values(acumulado[categoria]).sort((a, b) => b.puntos - a.puntos);
    }
    res.json(rankingPorCategoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking del torneo' });
  }
};

exports.confirmarParticipacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;
    const torneo = await Torneo.findById(id).populate('creador');
    if (!torneo) return res.status(404).json({ msg: 'Torneo no encontrado' });

    const usuario = await User.findById(req.user.id);

    if (respuesta === 'SI') {
      if (!torneo.participantes.some(u => u.toString() === usuario._id.toString())) {
        torneo.participantes.push(usuario._id);
        await torneo.save();
      }
      return res.json({ msg: 'Participación confirmada' });
    }

    try {
      await sendEmail(
        torneo.creador.email,
        'Participación rechazada',
        `<p>${usuario.nombre} ${usuario.apellido} no participará en ${torneo.nombre}.</p>`
      );
      await Notification.create({
        usuario: torneo.creador._id,
        mensaje: `${usuario.nombre} ${usuario.apellido} no participará en ${torneo.nombre}.`,
        torneo: torneo._id
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
