import type { FormKitSchemaCondition, FormKitSchemaNode } from '@formkit/core';
import type { ComputedRef } from 'vue';

import type { FormKitInputType } from '@/plugins/formkit.config';

export interface CrudField {
    type: FormKitInputType;
    name: string;
    label: string;
    validation?: string | [rule: string, ...args: any[]][];
    validationMessages?: Record<string, string>;
    options?: any;
    option?: { label: string; value: string };
    // Should be refactored out of CrudField
    value?: any;
    // Sometimes a field can be an object (e.g. api key of a company, user company role, ...)
    // This function returns the correct key to be used as value
    valueMapper?: (_param: any) => void;
    disabled?: boolean | ComputedRef<boolean>;
    help?: string;
    placeholder?: string;
    // Function that is called when field has changed value
    // Can be used when listening to @field-changed event is too generic
    changed?: (_value: any) => void;
    // If an entity is being created, this function will be called to get the default value
    defaultValue?: () => any;
    emptyMessage?: string;

    // A message can be next to the label to warn the user about something
    warning?: string;

    // Used for text areas
    maxLength?: number;

    allowNewValues?: boolean;

    sectionsSchema?: Record<string, FormKitSchemaCondition | Partial<FormKitSchemaNode>>;

    mode?: string;

    validationVisibility?: 'blur' | 'submit' | 'live' | 'dirty' | undefined;

    tooltip?: string;
}
