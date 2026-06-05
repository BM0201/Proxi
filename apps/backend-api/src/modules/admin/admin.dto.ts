import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class AdminVerificationDecisionDto {
  @IsIn(['APPROVED', 'REJECTED', 'NEEDS_CORRECTION'])
  status!: 'APPROVED' | 'REJECTED' | 'NEEDS_CORRECTION';

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  rejectionReason?: string;
}
