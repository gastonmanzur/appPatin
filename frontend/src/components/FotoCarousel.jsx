import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FotoCarousel = ({ fotos }) => {
  const settings = {
    centerMode: true,
    centerPadding: '0px',
    slidesToShow: Math.min(3, fotos.length),
    infinite: true,
    arrows: true,
  };

  return (
    <Slider {...settings} className="photo-carousel">
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
