import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const arrowStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 1,
};

const PrevArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ ...arrowStyle, left: 0 }}
    className="btn btn-link text-decoration-none"
  >
    <i className="bi bi-chevron-left fs-2" />
    <span className="visually-hidden">Anterior</span>
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{ ...arrowStyle, right: 0 }}
    className="btn btn-link text-decoration-none"
  >
    <i className="bi bi-chevron-right fs-2" />
    <span className="visually-hidden">Siguiente</span>
  </button>
);

const FotoCarousel = ({ fotos }) => {
  const settings = {
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: Math.min(3, fotos.length),
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <Slider {...settings} className="photo-carousel">
      {fotos.map((f) => (
        <div key={f._id}>
          <img
              src={`${import.meta.env.VITE_API_URL || 'https://backend-app-s246.onrender.com'}/uploads/${f.imagen}`}
            alt="foto"
            style={{ width: '100%', height: '300px', objectFit: 'contain' }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default FotoCarousel;
