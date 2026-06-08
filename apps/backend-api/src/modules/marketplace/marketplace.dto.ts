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

  /** Tipo de Tarea. Por defecto STANDARD_TASK (Tarea estándar con ofertas). */
  @IsOptional()
  @IsIn(['QUICK_TASK', 'STANDARD_TASK', 'PACKAGE_PROJECT'])
  taskType?: 'QUICK_TASK' | 'STANDARD_TASK' | 'PACKAGE_PROJECT';

  /** Duración estimada en minutos. Si supera 1 día (1440 min) se sugiere PACKAGE_PROJECT. */
  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedDurationMinutes?: number;

  /** Requerimiento de herramientas del Proveedor independiente para la Tarea. */
  @IsOptional()
  @IsIn(['CLIENT_PROVIDES_TOOLS', 'PROVIDER_BRINGS_TOOLS', 'NO_TOOLS_REQUIRED'])
  toolRequirement?: 'CLIENT_PROVIDES_TOOLS' | 'PROVIDER_BRINGS_TOOLS' | 'NO_TOOLS_REQUIRED';

  /**
   * Responsabilidad de los materiales. Por regla de Proxi, el Proveedor NO
   * compra materiales por defecto: el Cliente los compra (con Lista Proxi si aplica).
   */
  @IsOptional()
  @IsIn([
    'CLIENT_ALREADY_HAS_MATERIALS',
    'CLIENT_NEEDS_PURCHASE_LIST',
    'NEEDS_DIAGNOSIS_FIRST',
    'NO_MATERIALS_REQUIRED',
  ])
  materialResponsibility?:
    | 'CLIENT_ALREADY_HAS_MATERIALS'
    | 'CLIENT_NEEDS_PURCHASE_LIST'
    | 'NEEDS_DIAGNOSIS_FIRST'
    | 'NO_MATERIALS_REQUIRED';
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
