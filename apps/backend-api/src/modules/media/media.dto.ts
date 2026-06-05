import { IsIn, IsString, MinLength } from 'class-validator';

export const MEDIA_PURPOSES = [
  'AVATAR',
  'PROVIDER_PORTFOLIO',
  'VERIFICATION_DOCUMENT',
  'VERIFICATION_SELFIE',
  'TASK_PHOTO',
  'TASK_VIDEO',
  'BOOKING_EVIDENCE',
  'DISPUTE_EVIDENCE',
] as const;

export type MediaPurposeValue = (typeof MEDIA_PURPOSES)[number];

/**
 * Cuerpo del formulario multipart de subida de archivos.
 * El archivo binario viaja en el campo `file`; este DTO valida el campo `purpose`.
 */
export class UploadMediaDto {
  @IsIn(MEDIA_PURPOSES as unknown as string[])
  purpose!: MediaPurposeValue;
}

/**
 * Cuerpo para asociar un archivo ya subido (MediaFile) a una entidad
 * (Tarea, Portafolio del Proveedor o Evidencia de la Reserva).
 */
export class AttachMediaDto {
  @IsString()
  @MinLength(1)
  mediaId!: string;
}
