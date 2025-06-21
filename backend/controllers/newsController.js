const News = require('../models/News');



exports.createNews = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    const imagen = req.file ? req.file.filename : null;

    const news = new News({
      titulo: titulo,
      contenido: contenido,
      autor: req.user.id,
      imagen: imagen
    });

    await news.save();
    res.json({ msg: 'Noticia creada correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al crear noticia' });
  }
};


exports.getNews = async (req, res) => {
  try {
    const noticias = await News.find().sort({ fecha: -1 }).limit(10).populate('autor', 'nombre apellido');
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener noticias' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const noticia = await News.findById(req.params.id).populate('autor', 'nombre apellido');
    if (!noticia) return res.status(404).json({ msg: 'Noticia no encontrada' });
    res.json(noticia);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener la noticia' });
  }
};
