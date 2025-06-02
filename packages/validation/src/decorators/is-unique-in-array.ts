import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsUniqueInArray(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUniqueInArray',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    if (!value) return true;
                    return (
                        value.filter(element => {
                            return element[relatedPropertyName] === true;
                        }).length == 1
                    );
                },
            },
        });
    };
}
