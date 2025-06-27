const Competencia = require('../models/Competencia');
const Patinador = require('../models/Patinador');


exports.getRankingGeneral = async (req, res) => {
  try {
    const competencias = await Competencia.find().populate('resultados.patinador');

    // Acumulador de puntos por club sumando todos sus patinadores
    const acumulado = {};

    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
        const club = res.patinador ? (res.patinador.club || 'General Rodriguez') : (res.club || 'General Rodriguez');
        const puntos = Number(res.puntos) || 0;
        acumulado[club] = (acumulado[club] || 0) + puntos;
      });
    });

    // Convertimos a array y ordenamos por puntos
    const ranking = Object.entries(acumulado)
      .map(([club, puntos]) => ({ club, puntos }))
      .sort((a, b) => b.puntos - a.puntos);

    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking de clubes' });
  }
};

exports.getRankingPorCategorias = async (req, res) => {
  try {
    const competencias = await Competencia.find().populate('resultados.patinador');

    // Acumulador general
    const acumulado = {};

    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
        if (!res.patinador) return;
        const categoria = res.patinador.categoria;
        const id = res.patinador._id.toString();

        if (!acumulado[categoria]) {
          acumulado[categoria] = {};
        }

        if (!acumulado[categoria][id]) {
          acumulado[categoria][id] = {
            patinador: res.patinador,
            puntos: 0
          };
        }

        acumulado[categoria][id].puntos += res.puntos;
      });
    });

    // Transformamos en arrays ordenados
    const rankingPorCategoria = {};

    for (const categoria in acumulado) {
      rankingPorCategoria[categoria] = Object.values(acumulado[categoria]).sort((a, b) => b.puntos - a.puntos);
    }

    res.json(rankingPorCategoria);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking por categorías' });
  }
};


exports.getRankingClubes = async (req, res) => {
  try {
    const competencias = await Competencia.find();

    const acumulado = {};

    competencias.forEach(comp => {
      comp.resultadosClub.forEach(resClub => {
        const club = resClub.club;

        if (!acumulado[club]) {
          acumulado[club] = 0;
        }

        acumulado[club] += resClub.puntos;
      });
    });

    const rankingClubes = Object.entries(acumulado)
      .map(([club, puntos]) => ({ club, puntos }))
      .sort((a, b) => b.puntos - a.puntos);

    res.json(rankingClubes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking de clubes' });
  }
};

exports.getRankingCategoriasCompetencia = async (req, res) => {
  try {
    const { id } = req.params;
    const competencia = await Competencia.findById(id).populate('resultados.patinador');
    if (!competencia) return res.status(404).json({ msg: 'Competencia no encontrada' });

    const rankings = {};
    competencia.resultados.forEach(res => {
      const categoria = res.patinador ? res.patinador.categoria : res.categoria;
      if (!rankings[categoria]) {
        rankings[categoria] = [];
      }

      rankings[categoria].push({
        nombre: res.patinador ? `${res.patinador.primerNombre} ${res.patinador.apellido}` : res.nombre,
        club: res.patinador ? res.patinador.club : res.club,
        puntos: res.puntos
      });
    });

    for (const cat in rankings) {
      rankings[cat].sort((a, b) => b.puntos - a.puntos);
    }

    res.json(rankings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking de la competencia' });
  }
};

