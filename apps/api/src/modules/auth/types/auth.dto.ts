import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class VerifyIdDto {
    @IsNotEmpty()
    idToken: string;
}

export class VerifyEmailDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is invalid' })
    email: string;
}
export class VerifyTokenDto {
    @IsNumber()
    @Min(100000)
    @Max(999999)
    token: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Email is invalid' })
    email: string;
}

export class RefreshTokenDto {
    accessToken: string;
}

export class LocalLoginDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
