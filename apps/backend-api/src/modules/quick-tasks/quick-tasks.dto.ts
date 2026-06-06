import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PricingType, QuickTaskMode } from '@proxi/contracts';

/**
 * Cuerpo para crear una Tarea rápida (QUICK_TASK).
 * Las Tareas rápidas son de corta duración (máximo 1 día = 1440 minutos) y se
 * resuelven por aceptación directa o por subasta rápida.
 */
export class CreateQuickTaskDto {
  @IsString()
  @MinLength(5)
  @MaxLength(140)
  title!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  categoryName!: string;

  @IsEnum(QuickTaskMode)
  quickTaskMode!: QuickTaskMode;

  @IsNumber()
  @Min(1)
  @Max(1440, { message: 'Una Tarea rápida no puede superar 1 día (1440 minutos)' })
  estimatedDurationMinutes!: number;

  @IsNumber()
  @Min(0.1)
  @Max(100)
  radiusKm!: number;

  @IsOptional()
  @IsString()
  locationId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  budgetMax?: number;

  @IsOptional()
  @IsIn([
    PricingType.FIXED,
    PricingType.HOURLY,
    PricingType.TECHNICAL_VISIT,
    PricingType.OPEN_TO_OFFERS,
  ])
  pricingType?: PricingType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  minProviderRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minProviderTrustScore?: number;
}
