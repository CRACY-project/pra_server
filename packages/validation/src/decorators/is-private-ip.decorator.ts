import { isPrivateIP } from '@cracy/utils';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPrivateIP(validationOptions?: ValidationOptions) {
    return function (obj: any, propertyName: string) {
        registerDecorator({
            name: 'isPrivateIP',
            target: obj.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(ipRange: string) {
                    return isPrivateIP(ipRange);
                },
            },
        });
    };
}
