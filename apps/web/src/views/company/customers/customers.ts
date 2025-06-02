import { CompanyValidation } from '@cracy/validation';

import type { CrudField } from '@/types/input/crudModal';

export const nameField: CrudField = {
    label: 'Name',
    type: 'text',
    name: 'name',
    validation: [['required'], ['alphanumeric'], ['length', 0, CompanyValidation.displayName.maxLength]],
};

export const displayNameField: CrudField = {
    label: 'Display name',
    type: 'text',
    name: 'displayName',
    validation: [['required'], ['length', 0, CompanyValidation.displayName.maxLength]],
};

export const websiteField: CrudField = {
    type: 'text',
    name: 'websiteUrl',
    label: 'Website URL',
    validation: [['isValidCompanyURL']],
    placeholder: 'Enter a valid website URL',
};

export const headers = [
    {
        displayName: 'Name',
        key: 'displayName',
        enableSorting: true,
    },
    {
        key: 'chevron',
        displayName: '',
        enableSorting: false,
    },
];

export const crudFields = {
    name: {
        label: 'Name',
        type: 'text',
        name: 'name',
        validation: [['required'], ['hostnameValidation']],
        value: null,
    },
};
