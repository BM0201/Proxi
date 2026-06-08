import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Cuerpo para actualizar una herramienta del Proveedor independiente.
 */
export class UpdateProviderToolDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
