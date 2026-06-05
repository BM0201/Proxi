import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ProviderVerificationDto {
  @IsString()
  @MinLength(1)
  identityDocumentFrontMediaId!: string;

  @IsString()
  @IsOptional()
  identityDocumentBackMediaId?: string;

  @IsString()
  @IsOptional()
  selfieMediaId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class ProviderCertificationDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  issuer?: string;

  @IsString()
  @MinLength(1)
  mediaId!: string;
}
