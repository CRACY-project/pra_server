import { Company, User, UserRole } from '@cracy/database';
import { Request } from 'express';

export interface UserInRequest extends User {
    company: Company;
    userRoles: UserRole[];
}

export interface RequestWithUser extends Request {
    user: UserInRequest;
    refreshToken?: string;
}
