function calcularCategoria(fechaNacimiento, sexo, nivel) {
  const año = new Date(fechaNacimiento).getFullYear();
  let categoriaBase = '';

  if (sexo === 'F') {
    if (año <= 2007) categoriaBase = 'MD';
    else if ([2008, 2009, 2010].includes(año)) categoriaBase = 'JD';
    else if ([2011, 2012].includes(año)) categoriaBase = '4D';
    else if ([2013, 2014].includes(año)) categoriaBase = '5D';
    else if ([2015, 2016].includes(año)) categoriaBase = '6D';
    else if ([2017, 2018].includes(año)) categoriaBase = 'PD';
    else if ([2019, 2020].includes(año)) categoriaBase = 'M7D';
    else if (año === 2021) categoriaBase = 'CHD';
  } else {
    if (año <= 2007) categoriaBase = 'MV';
    else if ([2008, 2009, 2010].includes(año)) categoriaBase = 'JV';
    else if ([2011, 2012].includes(año)) categoriaBase = '4V';
    else if ([2013, 2014].includes(año)) categoriaBase = '5V';
    else if ([2015, 2016].includes(año)) categoriaBase = '6V';
    else if ([2017, 2018].includes(año)) categoriaBase = 'PV';
    else if ([2019, 2020].includes(año)) categoriaBase = 'M7V';
    else if (año === 2021) categoriaBase = 'CHV';
  }

  let sufijo = '';
  switch (nivel) {
    case 'Federado': sufijo = 'F'; break;
    case 'Intermedia': sufijo = 'I'; break;
    case 'Transicion': sufijo = 'T'; break;
    case 'Escuela': sufijo = 'E'; break;
  }

  return categoriaBase + sufijo;
}

module.exports = calcularCategoria;
