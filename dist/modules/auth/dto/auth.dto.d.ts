import { UserRole } from '../../../schemas/user.schema';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
    role?: UserRole;
    ownerId?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
