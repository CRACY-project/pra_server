import type { PDEDto } from '@cracy/typescript-client';

import type { IHeader } from '@/types/crud-components';

export const headers: IHeader<PDEDto>[] = [
    {
        displayName: 'Name',
        key: 'name',
        enableSorting: true,
    },
    {
        displayName: 'Type',
        key: 'type',
        enableSorting: false,
    },
    {
        displayName: 'Detected Problems',
        key: 'problems',
        enableSorting: false,
    },
    {
        displayName: 'Security Score',
        key: 'securityScore',
        enableSorting: false,
    },
];

export interface PDEFormData {
    name: string;
    serialNumber: string;
    token: string;
    apiKey: string;
}
