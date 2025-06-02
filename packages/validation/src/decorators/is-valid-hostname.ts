import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import { isValidHostname } from '@cracy/utils';
export function IsValidHostname(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsValidHostname',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return isValidHostname(value);
                },
            },
        });
    };
}
