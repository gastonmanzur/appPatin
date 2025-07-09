const Torneo = require('../models/Torneo');
const Competencia = require('../models/Competencia');

exports.crearTorneo = async (req, res) => {
  try {
    const { nombre, descripcion, fechaInicio, fechaFin } = req.body;
    const torneo = new Torneo({
      nombre,
      descripcion,
      fechaInicio,
      fechaFin,
      creador: req.user.id,
      competencias: []
    });
    await torneo.save();
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
