import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PrevArrow = ({ onClick }) => (
  <button type="button" className="carousel-control-prev" onClick={onClick}>
    <span className="carousel-control-prev-icon" aria-hidden="true" />
    <span className="visually-hidden">Anterior</span>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button type="button" className="carousel-control-next" onClick={onClick}>
    <span className="carousel-control-next-icon" aria-hidden="true" />
    <span className="visually-hidden">Siguiente</span>
  </button>
);

const FotoCarousel = ({ fotos }) => {
  const settings = {
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: Math.min(3, fotos.length),
    infinite: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Slider {...settings} className="photo-carousel carousel slide">
      {fotos.map((f) => (
        <div key={f._id}>
          <img
            src={`http://localhost:5000/uploads/${f.imagen}`}
            alt="foto"
            style={{ width: '100%', height: '300px', objectFit: 'contain' }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default FotoCarousel;
