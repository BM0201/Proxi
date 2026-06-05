import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  label!: string;

  @IsString()
  @MaxLength(80)
  country = 'Nicaragua';

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  department!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  city!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  zone!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  addressLine1!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  addressLine2?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  accuracyMeters?: number;

  @IsBoolean()
  @IsOptional()
  isExact?: boolean;

  @IsIn(['PRIVATE', 'APPROXIMATE', 'BOOKING_ONLY'])
  @IsOptional()
  visibility?: 'PRIVATE' | 'APPROXIMATE' | 'BOOKING_ONLY';
}
