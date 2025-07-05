import React from 'react';

const Nosotros = () => (
  <div className="nosotros">
    <h2 className="mb-4">Nuestra Historia</h2>
    <p>
      Somos un club apasionado por el patinaje que nació de un pequeño grupo de
      entusiastas. Con el tiempo fuimos creciendo y hoy celebramos numerosos
      logros deportivos y un fuerte sentido de comunidad. Nuestro objetivo es
      fomentar la disciplina, el compañerismo y el desarrollo integral de cada
      patinador.
    </p>
    <div className="row mt-4">
      <div className="col-md-4 mb-3">
        <img
          src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
          alt="Historia 1"
          className="img-fluid rounded"
        />
      </div>
      <div className="col-md-4 mb-3">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          alt="Historia 2"
          className="img-fluid rounded"
        />
      </div>
      <div className="col-md-4 mb-3">
        <img
          src="https://images.unsplash.com/photo-1527090496-346715f92429"
          alt="Historia 3"
          className="img-fluid rounded"
        />
      </div>
    </div>
  </div>
);

export default Nosotros;
