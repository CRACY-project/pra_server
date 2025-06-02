import { mixin } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Allow, IsEnum } from 'class-validator';

import { stringToArray } from '@/decorators/string-t0-array.decorator';
import { stringToObject } from '@/decorators/string-to-object.decorator';

const FilterMatchType = {
    CONTAINS: 'CONTAINS',
    EQUALS: 'EQUALS',
    EQUALS_NUMBER: 'EQUALS_NUMBER',
    EQUALS_BOOLEAN: 'EQUALS_BOOLEAN',
    GT: 'GT',
    LT: 'LT',
};
export type FilterMatchType = (typeof FilterMatchType)[keyof typeof FilterMatchType];

export function withFilter<T>({ fields }: { fields: (keyof T)[] }) {
    class Filter {
        @Type(() => String)
        @ApiProperty({ required: true, enum: fields })
        field: keyof T;

        @Transform(stringToArray)
        @ApiProperty({ required: true, enum: FilterMatchType })
        @IsEnum(FilterMatchType, { each: true })
        matchType: FilterMatchType;

        @Type(() => String)
        @ApiProperty({ required: true })
        value: string;

        @Type(() => String)
        @ApiProperty({ required: false })
        path?: string;
    }

    return mixin(Filter);
}

export function withPagination() {
    class Pagination {
        @ApiProperty({ required: false })
        @Type(() => Number)
        skip?: number;

        @ApiProperty({ required: false })
        @Type(() => Number)
        take?: number;
    }
    return mixin(Pagination);
}

export function withGetQuery<T, U = any>({ fields }: { fields: (keyof T)[] }) {
    class GetQuery {
        @Allow()
        @ApiProperty({ required: false })
        @Type(() => Number)
        skip?: number;

        @Allow()
        @ApiProperty({ required: false })
        @Type(() => Number)
        take?: number;

        @Allow()
        @Transform(stringToArray)
        @Type(() => String)
        @ApiProperty({ isArray: true, enum: fields, required: false })
        fields?: (keyof T)[];

        @Allow()
        @ApiProperty({ required: false })
        search?: string;

        @Allow()
        @ApiProperty({
            type: 'object',
            required: [],
            example: { orderBy: { id: 'asc' } },
            additionalProperties: { type: 'string' },
        })
        @Transform(stringToObject)
        orderBy?: {
            [key: string]: 'asc' | 'desc';
        };

        @Allow()
        @Type(() => Array<U>)
        filters?: Array<U>;
    }
    return mixin(GetQuery);
}
