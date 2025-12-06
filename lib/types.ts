// lib/types.ts

export type TipoLugar =
  | "CASA"
  | "DEPARTAMENTO"
  | "BODEGA"
  | "LOCAL"
  | "OFICINA"
  | "OTRO";

export interface BudgetData {
  cliente: string;
  direccion: string;
  tipoLugar: TipoLugar;
}

export interface Service {
  id: string;
  tipoServicio: 'PINTURA';
  cantidadM2: number;
  tipoSuperficie: 'LISO' | 'RUGOSO' | 'EXTRARUGOSO';
  marcaModelo: string;
}

export interface Area {
  id: string;
  name: string;
  location: "INTERIOR" | "EXTERIOR";
  services: Service[];
}
