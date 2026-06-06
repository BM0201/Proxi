import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ReputationEventType, UserRole } from '@proxi/contracts';

/** Cuerpo para crear una reseña sobre una reserva completada. */
export class CreateReviewDto {
  @IsString()
  bookingId!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}

/** Cuerpo para registrar manualmente un evento de reputación (uso administrativo). */
export class CreateReputationEventDto {
  @IsString()
  userId!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsEnum(ReputationEventType)
  eventType!: ReputationEventType;

  @IsInt()
  @Min(-100)
  @Max(100)
  scoreImpact!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;

  @IsOptional()
  @IsString()
  relatedTaskId?: string;

  @IsOptional()
  @IsString()
  relatedBookingId?: string;
}
