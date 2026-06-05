import { IsIn, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class UploadMediaDto {
  @IsIn([
    'AVATAR',
    'PROVIDER_PORTFOLIO',
    'VERIFICATION_DOCUMENT',
    'VERIFICATION_SELFIE',
    'TASK_PHOTO',
    'TASK_VIDEO',
    'BOOKING_EVIDENCE',
    'DISPUTE_EVIDENCE',
  ])
  purpose!:
    | 'AVATAR'
    | 'PROVIDER_PORTFOLIO'
    | 'VERIFICATION_DOCUMENT'
    | 'VERIFICATION_SELFIE'
    | 'TASK_PHOTO'
    | 'TASK_VIDEO'
    | 'BOOKING_EVIDENCE'
    | 'DISPUTE_EVIDENCE';

  @IsString()
  @MaxLength(255)
  originalName!: string;

  @IsString()
  @MaxLength(120)
  mimeType!: string;

  @IsInt()
  @Min(1)
  @Max(50 * 1024 * 1024)
  sizeBytes!: number;
}
