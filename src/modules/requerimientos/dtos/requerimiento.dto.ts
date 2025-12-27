export class CreateRequerimientoDto {
  sede_id!: number;
  hora_inicio!: string;     
  hora_fin!: string;        
  fecha_servicio!: string;  
  cantidad_personal!: number;
  
  herramienta?: string;
  viatico?: number;
  adicional?: number;
  extra_info?: string;
}

export class UpdateRequerimientoDto implements Partial<CreateRequerimientoDto> {
  sede_id?: number;
  hora_inicio?: string;
  hora_fin?: string;
  fecha_servicio?: string;
  cantidad_personal?: number;
  herramienta?: string;
  viatico?: number;
  adicional?: number;
  extra_info?: string;
}