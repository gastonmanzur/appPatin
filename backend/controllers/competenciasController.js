const Competencia = require('../models/Competencia');
const User = require('../models/User');
const Patinador = require('../models/Patinador');
const sendEmail = require('../utils/sendEmail');
const Notification = require('../models/Notification');

exports.crearCompetencia = async (req, res) => {
  try {
    const { nombre, descripcion, fecha } = req.body;

    const competencia = new Competencia({
      nombre,
      descripcion,
      fecha,
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

    competencia.resultados = resultados;

    // Calcular puntos por club incluyendo corredores externos
    const patinadoresIds = resultados
      .filter(r => r.patinador)
      .map(r => r.patinador);
    const patinadores = await Patinador.find({ _id: { $in: patinadoresIds } });
    const acumulado = {};

    resultados.forEach(res => {
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
    const { nombre, descripcion, fecha } = req.body;
    await Competencia.findByIdAndUpdate(id, { nombre, descripcion, fecha });
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
