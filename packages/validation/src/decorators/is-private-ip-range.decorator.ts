import { isPrivateIPRange } from '@cracy/utils';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPrivateIPRange(validationOptions?: ValidationOptions) {
    return function (obj: any, propertyName: string) {
        registerDecorator({
            name: 'isPrivateIPRange',
            target: obj.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(ipRange: string) {
                    return isPrivateIPRange(ipRange);
                },
            },
        });
    };
}
