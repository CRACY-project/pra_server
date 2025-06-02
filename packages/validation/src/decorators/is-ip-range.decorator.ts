import { registerDecorator, ValidationOptions } from 'class-validator';
import IPCIDR from 'ip-cidr';

export function IsIPRange(validationOptions?: ValidationOptions) {
    return function (obj: any, propertyName: string) {
        registerDecorator({
            name: 'isIPRange',
            target: obj.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(ipRange: string) {
                    return IPCIDR.isValidCIDR(ipRange);
                },
            },
        });
    };
}
