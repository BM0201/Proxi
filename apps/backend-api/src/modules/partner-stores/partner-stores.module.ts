/**
 * Módulo partner-stores: tiendas/ferreterías sugeridas.
 */
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PartnerStoresController } from './partner-stores.controller';
import { PartnerStoresService } from './partner-stores.service';

@Module({
  imports: [AuthModule],
  controllers: [PartnerStoresController],
  providers: [PartnerStoresService],
  exports: [PartnerStoresService],
})
export class PartnerStoresModule {}
