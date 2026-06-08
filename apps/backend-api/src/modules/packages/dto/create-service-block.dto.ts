import {
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

/**
 * Cuerpo para agregar un bloque de servicio acordado a un paquete/proyecto.
 * Un bloque representa una jornada/franja acordada (NO es jornada laboral
 * obligatoria): fecha, hora de inicio y hora de fin, en formato HH:mm.
 */
export class CreateServiceBlockDto {
  @IsDateString()
  date!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'startTime debe tener formato HH:mm' })
  startTime!: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'endTime debe tener formato HH:mm' })
  endTime!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
