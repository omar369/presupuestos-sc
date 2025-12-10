// lib/types.ts

export type TipoLugar =
  | "CASA"
  | "DEPARTAMENTO"
  | "BODEGA"
  | "LOCAL"
  | "OFICINA"
  | "OTROS";

export interface BudgetData {
  cliente: string;
  direccion: string;
  tipoLugar: TipoLugar;
}

export interface Service {
  id: string;
  tipoServicio: 'PINTURA' | 'ESMALTE' | 'SELLO' | 'EPOXICO' | 'OTROS';
  unidadDeMedida: 'm2' | 'ml';
  cantidadM2: string;
  tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO' | 'SENCILLO' | 'MEDIO' | 'DIFICIL';
  marcaModelo: string;
}

export interface Area {
  id: string;
  name: string;
  location: "INTERIOR" | "EXTERIOR";
  services: Service[];
}
