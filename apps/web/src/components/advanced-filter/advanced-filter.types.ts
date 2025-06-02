import type { FormKitOptionsList } from '@formkit/inputs';

import type { FormKitInputType } from '@/plugins/formkit.config';

const AdvancedFilterType = {
    string: 'string',
    date: 'date',
    enum: 'enum',
};
export type AdvancedFilterType = (typeof AdvancedFilterType)[keyof typeof AdvancedFilterType];

const AdvancedFilterMatchType = {
    GT: 'GT',
    GT_NUMBER: 'GT_NUMBER',
    LT: 'LT',
    LT_NUMBER: 'LT_NUMBER',
    CONTAINS: 'CONTAINS',
    EQUALS: 'EQUALS',
    EQUALS_BOOLEAN: 'EQUALS_BOOLEAN',
    EQUALS_NUMBER: 'EQUALS_NUMBER',
};
export type AdvancedFilterMatchType = keyof typeof AdvancedFilterMatchType;

export interface Option {
    label: string;
    value: string;
}

export interface AdvancedFilterField {
    type: AdvancedFilterType;
    label: string;
    value: string;
    options?: FormKitOptionsList | string[];
    path?: string;
}

export interface AdvancedFilter<T = any> {
    field: keyof T;
    matchType: AdvancedFilterMatchType;
    value: string;
    path?: string;
}

export const matchTypes = {
    date: [
        {
            label: 'AFTER',
            value: 'GT',
        },
        {
            label: 'BEFORE',
            value: 'LT',
        },
    ],
    string: [
        {
            label: 'CONTAINS',
            value: 'CONTAINS',
        },
        {
            label: 'EQUALS',
            value: 'EQUALS',
        },
    ],
    enum: [
        {
            label: 'EQUALS',
            value: 'EQUALS',
        },
    ],
    boolean: [
        {
            label: 'EQUALS',
            value: 'EQUALS_BOOLEAN',
        },
    ],
    number: [
        {
            label: 'EQUALS',
            value: 'EQUALS_NUMBER',
        },
        {
            label: 'MORE THAN',
            value: 'GT_NUMBER',
        },
        {
            label: 'LESS THAN',
            value: 'LT_NUMBER',
        },
    ],
};

export const fieldTypes: { [key: string]: FormKitInputType } = {
    date: 'datetime-local',
    string: 'text',
    enum: 'dropdown',
    boolean: 'dropdown',
    number: 'number',
};
