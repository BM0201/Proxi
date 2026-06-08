import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Cuerpo para crear una Lista Proxi de materiales para una Tarea.
 */
export class CreatePurchaseListDto {
  @IsString()
  @MinLength(1)
  taskId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
