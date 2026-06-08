import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { MaterialItemPriority } from '@proxi/contracts';

/**
 * Cuerpo para agregar un ítem a una Lista Proxi de materiales.
 */
export class CreatePurchaseListItemDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name!: string;

  @IsNumber()
  @Min(0.01, { message: 'La cantidad debe ser mayor a cero' })
  quantity!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(40)
  unit!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  specification?: string;

  @IsOptional()
  @IsEnum(MaterialItemPriority)
  priority?: MaterialItemPriority;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedPriceMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedPriceMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
