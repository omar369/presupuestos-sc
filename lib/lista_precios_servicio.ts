export interface IServicePriceList {
  [serviceType: string]: {
    [claveDeServicio: string]: number; // La clave de servicio mapeada a su precio por unidad (ej. m2)
  };
}

//Rnagos por M2
export const RANGO_M2_MAP = {
  '0-300': 'A',
  '301-600': 'B',
  '601-5000': 'C',
};

//función para ubicar Rango por M2
export function getRangoM2Key(cantidadM2: number): string {
  if (cantidadM2 >= 0 && cantidadM2 <= 300) return RANGO_M2_MAP['0-300'];
  if (cantidadM2 >= 301 && cantidadM2 <= 600) return RANGO_M2_MAP['301-600'];
  if (cantidadM2 >= 601 && cantidadM2 <= 5000) return RANGO_M2_MAP['601-5000'];
  // agregar else despues... 
  return 'X'; // mientas culaquier identificador de error
}

//LISTA DE PRECIOS
export const ServiciosPrecios: IServicePriceList = {
  PINTURA: {
    //LAS PRIMERAS 9 LISTAS DE STAR COLORS VIN-R PRO EXTERIOR...
    // Superficie LISO (vinR, 7 años)
    'PEALSCVinR': 73.00,
    'PEBLSCVinR': 70.00,
    'PECLSCVinR': 67.00,

    // Superficie RUGOSO
    'PEARSCVinR': 85.00,
    'PEBRSCVinR': 82.00,
    'PECRSCVinR': 79.00,

    // Superficie EXTRARUGOSO
    'PEAXSCVinR': 95.00,
    'PEBXSCVinR': 92.00,
    'PECXSCVinR': 89.00,

    // -- STAR COLORS VIN-R PRO INTERIOR --
    // Superficie LISO (vinR, 7 años)
    'PIALSCVinR': 73.00,
    'PIBLSCVinR': 70.00,
    'PICLSCVinR': 67.00,

    // Superficie RUGOSO
    'PIARSCVinR': 85.00,
    'PIBRSCVinR': 82.00,
    'PICRSCVinR': 79.00,

    // Superficie EXTRARUGOSO
    'PIAXSCVinR': 95.00,
    'PIBXSCVinR': 92.00,
    'PICXSCVinR': 89.00,

    //claves:precioUnit... 
  },
  IMPERMEABILIZANTE: {
    //..
    ////....
  }
};
