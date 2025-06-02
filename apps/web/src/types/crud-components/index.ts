import type { IHeader as SharedIHeader } from '@jimber/shared-components';
import { type Component } from 'vue';

import type { AdvancedFilterField } from '@/components/advanced-filter/advanced-filter.types';
import type { CrudField } from '@/types/input/crudModal';

export interface CrudForm {
    component: Component;
    props: any;
}

export interface IEntityCreateOptions<FormEntity = any> {
    // Either use fields or the correct slot
    fields?: CrudField[];

    submitHandler: (_formData: FormEntity) => Promise<any>;
}

export interface IEntityUpdateOptions<Entity = any, FormEntity = any> {
    // Either use fields or the correct slot
    fields?: CrudField[] | ((_entity: Entity) => CrudField[]);

    submitHandler: (_formData: FormEntity, _oldEntity: Entity) => Promise<any>;
    disableAction?: (_entity: Entity) => boolean;
    hideAction?: (_entity: Entity) => boolean;
}

export interface IEntityCopyOptions<Entity = any, FormEntity = any> {
    // Either use fields or the correct slot
    fields?: CrudField[];

    submitHandler: (_formData: FormEntity, _oldEntity: Entity) => Promise<any>;
    disableAction?: (_entity: Entity) => boolean;
    hideAction?: (_entity: Entity) => boolean;
}

export interface IEntityDeleteOptions<Entity = any> {
    disableAction?: (_entity: Entity) => boolean;
    hideAction?: (_entity: Entity) => boolean;

    // array of strings warning user which entities will also be deleted
    deletes?: string[];
    submitHandler?: (_entity: Entity) => Promise<any>;
}

export interface IEntityExceptions {
    conflict: { [index: string]: string };
}

export interface IEntityOptionsActions<Entity = any, FormEntity = any> {
    copy?: IEntityUpdateOptions<Entity, FormEntity>;
    create?: IEntityCreateOptions<FormEntity>;
    read?: (_entity: Entity) => Promise<any>;
    update?: IEntityUpdateOptions<Entity, FormEntity>;
    delete?: IEntityDeleteOptions<Entity>;
    exceptions?: IEntityExceptions;
}
export interface IEntityOptions<Entity = any, FormEntity = any> {
    // The type of entity that will be displayed in the table (Server, User, Daemon)
    displayName: string; // should be displayType?
    displayKey: keyof Entity;
    actions?: IEntityOptionsActions<Entity, FormEntity>;
    // Sometimes an entity does map 1-to-1 to a form, relations, complex objects, etc..
    entityToFormMapper?: (_entity: Entity) => FormEntity;
    showNameInUpdate?: boolean;
}

export interface PaginationOptions {
    itemsPerPage: number;
}

export interface IEntityProvider<Entity = any> {
    getEntities: (_data: {
        pagination?: { skip: number; take: number };
        filters?: { searchString?: string };
        orderBy?: { [index: string]: 'asc' | 'desc' };
        advancedFilters?: any;
    }) => Promise<{ size: number; data: Entity[] }>;
}

export interface CrudTableProps<Entity = any> {
    headers: IHeader<any>[];
    entities?: Entity[];
    entityProvider?: IEntityProvider<Entity>;
    entityOptions: IEntityOptions<Entity>;
    emptyMessage: string;
    showReloadButton?: boolean;
    openWithSingleClick?: boolean;
    searchOptions?: SearchOptions;
    showGetStartedComponentIfEmpty?: boolean;
    backendPaginationSorting?: boolean;
    pagination?: PaginationOptions;
    takeMinimalSpace?: boolean;
    showAdvancedFilter?: boolean;
    advancedFilterFields?: AdvancedFilterField[];
    navigateWithSingleClick?: INavigateWithSingleClick<Entity>;
}

interface enumOptions {
    filterKey: string;
    translationKey: string;
    options: string[];
}
export interface SearchOptions {
    enableSearch: boolean;
    options: string[];
    enumOptions?: enumOptions;
    whitelistedOptions?: string[];
    blacklistedOptions?: string[];
    matchCase?: boolean;
}

export const CrudActionType = {
    create: 'create',
    update: 'update',
    delete: 'delete',
    add: 'add',
    copy: 'duplicate',
} as const;
export type CrudActionType = (typeof CrudActionType)[keyof typeof CrudActionType];

export interface CreateFieldsSlot<FormEntity = any> {
    formData: FormEntity;
}
export interface UpdateFieldsSlot<Entity, FormEntity = any> {
    formData: FormEntity;
    entity: Entity;
}

export type CrudExceptionHandler = (_params: { entityExceptions: IEntityExceptions; message: any }) => string[];

export interface IHeader<T extends Record<string, any>> extends SharedIHeader<T> {
    copyable?: boolean;
}

export interface INavigateWithSingleClick<Entity> {
    basePath: string;
    navigationKey: keyof Entity extends string ? keyof Entity : never;
}
