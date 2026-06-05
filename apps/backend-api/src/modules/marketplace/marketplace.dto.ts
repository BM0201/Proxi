import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  categoryName!: string;

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
  @IsIn(['FIXED', 'HOURLY', 'DAILY', 'TECHNICAL_VISIT', 'OPEN_TO_OFFERS'])
  pricingType?: 'FIXED' | 'HOURLY' | 'DAILY' | 'TECHNICAL_VISIT' | 'OPEN_TO_OFFERS';
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  categoryName?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(140)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  description?: string;

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
  @IsIn(['DRAFT', 'PUBLISHED', 'RECEIVING_OFFERS', 'CANCELLED'])
  status?: 'DRAFT' | 'PUBLISHED' | 'RECEIVING_OFFERS' | 'CANCELLED';
}

export class CreateOfferDto {
  @IsString()
  taskId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  estimatedDuration!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsBoolean()
  includesMaterials!: boolean;

  @IsBoolean()
  requiresTechnicalVisit!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  conditions?: string;
}
