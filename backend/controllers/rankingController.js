const Competencia = require('../models/Competencia');
const Patinador = require('../models/Patinador');


exports.getRankingGeneral = async (req, res) => {
  try {
    const competencias = await Competencia.find().populate('resultados.patinador');

    // Acumulador de puntos por patinador
    const acumulado = {};

    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
        const id = res.patinador._id.toString();
        if (!acumulado[id]) {
          acumulado[id] = {
            patinador: res.patinador,
            puntos: 0
          };
        }
        acumulado[id].puntos += res.puntos;
      });
    });

    // Convertimos a array y ordenamos por puntos
    const ranking = Object.values(acumulado).sort((a, b) => b.puntos - a.puntos);

    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al generar ranking' });
  }
};

exports.getRankingPorCategorias = async (req, res) => {
  try {
    const competencias = await Competencia.find().populate('resultados.patinador');

    // Acumulador general
    const acumulado = {};

    competencias.forEach(comp => {
      comp.resultados.forEach(res => {
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

