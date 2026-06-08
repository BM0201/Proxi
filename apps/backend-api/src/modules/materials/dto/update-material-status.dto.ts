import { IsEnum } from 'class-validator';
import { MaterialStatus } from '@proxi/contracts';

/**
 * Cuerpo para actualizar el estado de materiales de una Tarea / Lista Proxi.
 * Lo usa el Cliente para marcar materiales listos o reportar incorrectos/faltantes.
 */
export class UpdateMaterialStatusDto {
  @IsEnum(MaterialStatus)
  status!: MaterialStatus;
}
