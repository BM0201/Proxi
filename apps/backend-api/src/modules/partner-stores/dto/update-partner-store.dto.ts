import { IsBoolean, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreatePartnerStoreDto } from './create-partner-store.dto';

/**
 * Cuerpo para actualizar una tienda/ferretería sugerida (uso administrativo).
 */
export class UpdatePartnerStoreDto extends PartialType(CreatePartnerStoreDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
