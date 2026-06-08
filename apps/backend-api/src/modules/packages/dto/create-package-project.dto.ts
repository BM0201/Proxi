import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Cuerpo para crear un paquete/proyecto (PackageProject) a partir de una Tarea.
 * Un paquete agrupa varios bloques de servicio acordados a lo largo de días.
 */
export class CreatePackageProjectDto {
  @IsString()
  @MinLength(1)
  taskId!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(160)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsInt()
  @Min(1)
  totalDays!: number;

  @IsOptional()
  @IsDateString()
  estimatedStartDate?: string;

  @IsOptional()
  @IsDateString()
  estimatedEndDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;
}
