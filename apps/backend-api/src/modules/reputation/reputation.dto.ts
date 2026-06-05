import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

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
