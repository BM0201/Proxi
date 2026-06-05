/**
 * Módulo raíz de la API de Proxi.
 *
 * Registra la configuración global (con validación de entorno), la conexión
 * a la base de datos (Prisma), el módulo de salud y todos los módulos de negocio.
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './common/config/env.validation';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './common/health/health.module';

import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { BookingModule } from './modules/booking/booking.module';
import { ChatModule } from './modules/chat/chat.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReputationModule } from './modules/reputation/reputation.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    HealthModule,
    // Módulos de negocio
    AuthModule,
    IdentityModule,
    ProfilesModule,
    MarketplaceModule,
    PricingModule,
    BookingModule,
    ChatModule,
    PaymentsModule,
    ReputationModule,
    SubscriptionsModule,
    DisputesModule,
    MediaModule,
    NotificationsModule,
    AdminModule,
    LocationsModule,
  ],
})
export class AppModule {}
