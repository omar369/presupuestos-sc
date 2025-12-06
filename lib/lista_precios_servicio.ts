export interface IServicePriceList {
  [serviceType: string]: {
    [claveDeServicio: string]: {
      nombre: string;
      precio: number;
    };
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
    // --- STAR COLORS VIN R (Original: EXTERIOR PRO) ---
    // LISO
    'PEALSCVINR': { nombre: 'Star Colors Vinilica R Liso - Rango A', precio: 49 },
    'PEBLSCVINR': { nombre: 'Star Colors Vinilica R Liso - Rango B', precio: 47 },
    'PECLSCVINR': { nombre: 'Star Colors Vinilica R Liso - Rango C', precio: 45 },
    // RUGOSO
    'PEARSCVINR': { nombre: 'Star Colors Vinilica R Rugoso - Rango A', precio: 57 },
    'PEBRSCVINR': { nombre: 'Star Colors Vinilica R Rugoso - Rango B', precio: 54 },
    'PECRSCVINR': { nombre: 'Star Colors Vinilica R Rugoso - Rango C', precio: 51 },
    // EXTRARUGOSO
    'PEAXSCVINR': { nombre: 'Star Colors Vinilica R Extra-Rugoso - Rango A', precio: 74 },
    'PEBXSCVINR': { nombre: 'Star Colors Vinilica R Extra-Rugoso - Rango B', precio: 71 },
    'PECXSCVINR': { nombre: 'Star Colors Vinilica R Extra-Rugoso - Rango C', precio: 67 },

    // Versión INTERIOR (Mismos precios)
    'PIALSCVINR': { nombre: 'Star Colors Vinilica Interior R Liso - Rango A', precio: 49 },
    'PIBLSCVINR': { nombre: 'Star Colors Vinilica Interior R Liso - Rango B', precio: 47 },
    'PICLSCVINR': { nombre: 'Star Colors Vinilica Interior R Liso - Rango C', precio: 45 },
    'PIARSCVINR': { nombre: 'Star Colors Vinilica Interior R Rugoso - Rango A', precio: 57 },
    'PIBRSCVINR': { nombre: 'Star Colors Vinilica Interior R Rugoso - Rango B', precio: 54 },
    'PICRSCVINR': { nombre: 'Star Colors Vinilica Interior R Rugoso - Rango C', precio: 51 },
    'PIAXSCVINR': { nombre: 'Star Colors Vinilica Interior R Extra-Rugoso - Rango A', precio: 74 },
    'PIBXSCVINR': { nombre: 'Star Colors Vinilica Interior R Extra-Rugoso - Rango B', precio: 71 },
    'PICXSCVINR': { nombre: 'Star Colors Vinilica Interior R Extra-Rugoso - Rango C', precio: 67 },

    // --- STAR COLORS VIN E (Original: PREMIUM MATE) ---
    // LISO
    'PEALSCVINE': { nombre: 'Star Colors Vinilica E Liso - Rango A', precio: 52 },
    'PEBLSCVINE': { nombre: 'Star Colors Vinilica E Liso - Rango B', precio: 50 },
    'PECLSCVINE': { nombre: 'Star Colors Vinilica E Liso - Rango C', precio: 47 },
    // RUGOSO
    'PEARSCVINE': { nombre: 'Star Colors Vinilica E Rugoso - Rango A', precio: 61 },
    'PEBRSCVINE': { nombre: 'Star Colors Vinilica E Rugoso - Rango B', precio: 58 },
    'PECRSCVINE': { nombre: 'Star Colors Vinilica E Rugoso - Rango C', precio: 55 },
    // EXTRARUGOSO
    'PEAXSCVINE': { nombre: 'Star Colors Vinilica E Extra-Rugoso - Rango A', precio: 81 },
    'PEBXSCVINE': { nombre: 'Star Colors Vinilica E Extra-Rugoso - Rango B', precio: 77 },
    'PECXSCVINE': { nombre: 'Star Colors Vinilica E Extra-Rugoso - Rango C', precio: 73 },

    // Versión INTERIOR (Mismos precios)
    'PIALSCVINE': { nombre: 'Star Colors Vinilica Interior E Liso - Rango A', precio: 52 },
    'PIBLSCVINE': { nombre: 'Star Colors Vinilica Interior E Liso - Rango B', precio: 50 },
    'PICLSCVINE': { nombre: 'Star Colors Vinilica Interior E Liso - Rango C', precio: 47 },
    'PIARSCVINE': { nombre: 'Star Colors Vinilica Interior E Rugoso - Rango A', precio: 61 },
    'PIBRSCVINE': { nombre: 'Star Colors Vinilica Interior E Rugoso - Rango B', precio: 58 },
    'PICRSCVINE': { nombre: 'Star Colors Vinilica Interior E Rugoso - Rango C', precio: 55 },
    'PIAXSCVINE': { nombre: 'Star Colors Vinilica Interior E Extra-Rugoso - Rango A', precio: 81 },
    'PIBXSCVINE': { nombre: 'Star Colors Vinilica Interior E Extra-Rugoso - Rango B', precio: 77 },
    'PICXSCVINE': { nombre: 'Star Colors Vinilica Interior E Extra-Rugoso - Rango C', precio: 73 },

    // --- STAR COLORS VIN ES (Original: PREMIUM SATIN) ---
    // LISO
    'PEALSCVINES': { nombre: 'Star Colors Vinilica ES Liso - Rango A', precio: 58 },
    'PEBLSCVINES': { nombre: 'Star Colors Vinilica ES Liso - Rango B', precio: 56 },
    'PECLSCVINES': { nombre: 'Star Colors Vinilica ES Liso - Rango C', precio: 53 },
    // RUGOSO
    'PEARSCVINES': { nombre: 'Star Colors Vinilica ES Rugoso - Rango A', precio: 71 },
    'PEBRSCVINES': { nombre: 'Star Colors Vinilica ES Rugoso - Rango B', precio: 67 },
    'PECRSCVINES': { nombre: 'Star Colors Vinilica ES Rugoso - Rango C', precio: 65 },
    // EXTRARUGOSO
    'PEAXSCVINES': { nombre: 'Star Colors Vinilica ES Extra-Rugoso - Rango A', precio: 95 },
    'PEBXSCVINES': { nombre: 'Star Colors Vinilica ES Extra-Rugoso - Rango B', precio: 91 },
    'PECXSCVINES': { nombre: 'Star Colors Vinilica ES Extra-Rugoso - Rango C', precio: 86 },

    // Versión INTERIOR (Mismos precios)
    'PIALSCVINES': { nombre: 'Star Colors Vinilica Interior ES Liso - Rango A', precio: 58 },
    'PIBLSCVINES': { nombre: 'Star Colors Vinilica Interior ES Liso - Rango B', precio: 56 },
    'PICLSCVINES': { nombre: 'Star Colors Vinilica Interior ES Liso - Rango C', precio: 53 },
    'PIARSCVINES': { nombre: 'Star Colors Vinilica Interior ES Rugoso - Rango A', precio: 71 },
    'PIBRSCVINES': { nombre: 'Star Colors Vinilica Interior ES Rugoso - Rango B', precio: 67 },
    'PICRSCVINES': { nombre: 'Star Colors Vinilica Interior ES Rugoso - Rango C', precio: 65 },
    'PIAXSCVINES': { nombre: 'Star Colors Vinilica Interior ES Extra-Rugoso - Rango A', precio: 95 },
    'PIBXSCVINES': { nombre: 'Star Colors Vinilica Interior ES Extra-Rugoso - Rango B', precio: 91 },
    'PICXSCVINES': { nombre: 'Star Colors Vinilica Interior ES Extra-Rugoso - Rango C', precio: 86 },

    // --- STAR COLORS VIN PRO (Nuevo: PROFESIONAL) ---
    // LISO
    'PEALSCVINPRO': { nombre: 'Star Colors Vinilica Pro Liso - Rango A', precio: 62 },
    'PEBLSCVINPRO': { nombre: 'Star Colors Vinilica Pro Liso - Rango B', precio: 59 },
    'PECLSCVINPRO': { nombre: 'Star Colors Vinilica Pro Liso - Rango C', precio: 56 },
    // RUGOSO
    'PEARSCVINPRO': { nombre: 'Star Colors Vinilica Pro Rugoso - Rango A', precio: 77 },
    'PEBRSCVINPRO': { nombre: 'Star Colors Vinilica Pro Rugoso - Rango B', precio: 73 },
    'PECRSCVINPRO': { nombre: 'Star Colors Vinilica Pro Rugoso - Rango C', precio: 68 },
    // EXTRARUGOSO
    'PEAXSCVINPRO': { nombre: 'Star Colors Vinilica Pro Extra-Rugoso - Rango A', precio: 104 },
    'PEBXSCVINPRO': { nombre: 'Star Colors Vinilica Pro Extra-Rugoso - Rango B', precio: 99 },
    'PECXSCVINPRO': { nombre: 'Star Colors Vinilica Pro Extra-Rugoso - Rango C', precio: 94 },

    // Versión INTERIOR (Mismos precios)
    'PIALSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Liso - Rango A', precio: 62 },
    'PIBLSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Liso - Rango B', precio: 59 },
    'PICLSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Liso - Rango C', precio: 56 },
    'PIARSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Rugoso - Rango A', precio: 77 },
    'PIBRSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Rugoso - Rango B', precio: 73 },
    'PICRSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Rugoso - Rango C', precio: 68 },
    'PIAXSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Extra-Rugoso - Rango A', precio: 104 },
    'PIBXSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Extra-Rugoso - Rango B', precio: 99 },
    'PICXSCVINPRO': { nombre: 'Star Colors Vinilica Interior Pro Extra-Rugoso - Rango C', precio: 94 },
    //
    // --- COMEX COMXPRO1 (Original: VINLICA COMEX PRO1000) ---
    // LISO (Precios P.P.D.)
    'PEALCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Liso - Rango A', precio: 61 },
    'PEBLCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Liso - Rango B', precio: 58 },
    'PECLCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Liso - Rango C', precio: 55 },
    // RUGOSO (Precios P.P.D.)
    'PEARCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Rugoso - Rango A', precio: 75 },
    'PEBRCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Rugoso - Rango B', precio: 71 },
    'PECRCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Rugoso - Rango C', precio: 68 },
    // EXTRARUGOSO (Precios P.P.D.)
    'PEAXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Extra-Rugoso - Rango A', precio: 109 },
    'PEBXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Extra-Rugoso - Rango B', precio: 99 },
    'PECXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Exterior Extra-Rugoso - Rango C', precio: 93 },

    // Versión INTERIOR (Mismos precios)
    'PIALCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Liso - Rango A', precio: 61 },
    'PIBLCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Liso - Rango B', precio: 58 },
    'PICLCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Liso - Rango C', precio: 55 },
    'PIARCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Rugoso - Rango A', precio: 75 },
    'PIBRCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Rugoso - Rango B', precio: 71 },
    'PICRCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Rugoso - Rango C', precio: 68 },
    'PIAXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Extra-Rugoso - Rango A', precio: 109 },
    'PIBXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Extra-Rugoso - Rango B', precio: 99 },
    'PICXCOMXPRO1': { nombre: 'Comex Vinlica PRO 1000 Interior Extra-Rugoso - Rango C', precio: 93 },

    //
    // --- COMEX _ COMXVINIMX (Original: COMEX VINIMEX) ---
    //
    // LISO (Precios P.P.D.: 68, 65, 61)
    'PEALCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Liso - Rango A', precio: 68 },
    'PEBLCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Liso - Rango B', precio: 65 },
    'PECLCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Liso - Rango C', precio: 61 },
    // RUGOSO (Precios P.P.D.: 79, 81, 76)
    'PEARCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Rugoso - Rango A', precio: 79 },
    'PEBRCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Rugoso - Rango B', precio: 81 },
    'PECRCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Rugoso - Rango C', precio: 76 },
    // EXTRARUGOSO (Precios P.P.D.: 119, 105, 105)
    'PEAXCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Extra-Rugoso - Rango A', precio: 119 },
    'PEBXCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Extra-Rugoso - Rango B', precio: 105 },
    'PECXCOMXVINIMX': { nombre: 'Comex Vinimex Exterior Extra-Rugoso - Rango C', precio: 105 },

    // Versión INTERIOR (Mismos precios)
    'PIALCOMXVINIMX': { nombre: 'Comex Vinimex Interior Liso - Rango A', precio: 68 },
    'PIBLCOMXVINIMX': { nombre: 'Comex Vinimex Interior Liso - Rango B', precio: 65 },
    'PICLCOMXVINIMX': { nombre: 'Comex Vinimex Interior Liso - Rango C', precio: 61 },
    'PIARCOMXVINIMX': { nombre: 'Comex Vinimex Interior Rugoso - Rango A', precio: 79 },
    'PIBRCOMXVINIMX': { nombre: 'Comex Vinimex Interior Rugoso - Rango B', precio: 81 },
    'PICRCOMXVINIMX': { nombre: 'Comex Vinimex Interior Rugoso - Rango C', precio: 76 },
    'PIAXCOMXVINIMX': { nombre: 'Comex Vinimex Interior Extra-Rugoso - Rango A', precio: 119 },
    'PIBXCOMXVINIMX': { nombre: 'Comex Vinimex Interior Extra-Rugoso - Rango B', precio: 105 },
    'PICXCOMXVINIMX': { nombre: 'Comex Vinimex Interior Extra-Rugoso - Rango C', precio: 105 },
  },
  EPOXICO: {
    //
    // --- COMXEPOXMULTI (Original: EPÓXICO COMEX MULTIPRO) ---
    //
    // Superficie S (Precios P.P.D.)
    'PEASCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie S - Rango A', precio: 272 },
    'PEBSCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie S - Rango B', precio: 259 },
    'PECSCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie S - Rango C', precio: 244 },
    // Superficie M (Precios P.P.D.)
    'PEAMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie M - Rango A', precio: 355 },
    'PEBMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie M - Rango B', precio: 338 },
    'PECMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie M - Rango C', precio: 318 },
    // Superficie D (Precios P.P.D.)
    'PEADCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie D - Rango A', precio: 403 },
    'PEBDCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie D - Rango B', precio: 401 },
    'PECDCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Exterior Superficie D - Rango C', precio: 411 },

    // Versión INTERIOR (Mismos precios)
    'PIASCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie S - Rango A', precio: 272 },
    'PIBSCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie S - Rango B', precio: 259 },
    'PICSCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie S - Rango C', precio: 244 },
    'PIAMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie M - Rango A', precio: 355 },
    'PIBMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie M - Rango B', precio: 338 },
    'PICMCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie M - Rango C', precio: 318 },
    'PIADCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie D - Rango A', precio: 403 },
    'PIBDCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie D - Rango B', precio: 401 },
    'PICDCOMXEPOXMULTI': { nombre: 'Comex Epóxico Multipro Interior Superficie D - Rango C', precio: 411 },
  },
  IMPERMEABILIZANTE: {
    //..
  },
  SELLO: {
    // LISO (Fila superior de tablas)
    'SIALSCSR1': { nombre: 'Star Colors Acrisello Liso - Rango A', precio: 29 },
    'SIBLSCSR1': { nombre: 'Star Colors Acrisello Liso - Rango B', precio: 27 },
    'SICLSCSR1': { nombre: 'Star Colors Acrisello Liso - Rango C', precio: 26 },

    // RUGOSO (Fila central de tablas)
    'SIARSCSR1': { nombre: 'Star Colors Acrisello Rugoso - Rango A', precio: 37 },
    'SIBRSCSR1': { nombre: 'Star Colors Acrisello Rugoso - Rango B', precio: 35 },
    'SICRSCSR1': { nombre: 'Star Colors Acrisello Rugoso - Rango C', precio: 33 },

    // EXTRARUGOSO (Fila inferior de tablas)
    'SIAXSCSR1': { nombre: 'Star Colors Acrisello Extra-Rugoso - Rango A', precio: 52 }, // Servicio 100 - 350
    'SIBXSCSR1': { nombre: 'Star Colors Acrisello Extra-Rugoso - Rango B', precio: 49 }, // Servicio 351 - 600
    'SICXSCSR1': { nombre: 'Star Colors Acrisello Extra-Rugoso - Rango C', precio: 47 }, // Servicio 601 - 5000
  }
};
