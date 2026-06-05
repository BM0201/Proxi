import { IsEmail, IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Matches(/[a-z]/, { message: 'La contraseña debe incluir una minúscula' })
  @Matches(/[A-Z]/, { message: 'La contraseña debe incluir una mayúscula' })
  @Matches(/[0-9]/, { message: 'La contraseña debe incluir un número' })
  @Matches(/[^A-Za-z0-9]/, { message: 'La contraseña debe incluir un símbolo' })
  password!: string;

  @IsIn(['CLIENT', 'PROVIDER'])
  role!: 'CLIENT' | 'PROVIDER';
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
