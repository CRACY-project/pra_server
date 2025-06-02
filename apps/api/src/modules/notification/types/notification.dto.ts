import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

import { CompanyDto } from '@/modules/company/types/company.dto';
import { UserDto } from '@/modules/user/types/user.dto';

export const MappedNotificationType = {
    server: 'server',
    niac: 'NIAC',
    router: 'network controller',
};

const NotificationType: {
    server: 'server';
    niac: 'niac';
    router: 'router';
    adsync: 'adsync';
    deviceApproval: 'deviceApproval';
} = {
    server: 'server',
    niac: 'niac',
    router: 'router',
    adsync: 'adsync',
    deviceApproval: 'deviceApproval',
};

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export class NotificationSettingDto {
    id: number;
    userId?: number;
    user?: UserDto;
    company?: CompanyDto;
    companyId: number;
    @ApiProperty({
        enum: NotificationType,
        required: true,
    })
    type: NotificationType;
    value: boolean;
    email?: string;
}

export class CompanyContact {
    company: { name: string; id: number };
    user?: { email: string; id: number };
    email?: string;
}

export class CompanyContacts {
    [key: string]: CompanyContact[];
}

export class UpdateNotificationSettingDto {
    @ApiProperty({
        enum: NotificationType,
        required: true,
    })
    @IsString()
    type: NotificationType;

    @IsBoolean()
    value: boolean;

    @IsEmail()
    @IsOptional()
    email?: string;
}

export class UpdateNotificationSettingBodyDto {
    @Allow()
    settings: UpdateNotificationSettingDto[];
}

export class GetNotificationSettingsResponse {
    settings: NotificationSettingDto[];
}

export class AlertsCountDto {
    critical: number;
    major: number;
    minor: number;
}
