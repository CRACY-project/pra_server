import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { createClassDecorator } from '@nestjs/swagger/dist/decorators/helpers';

export function ApiExcludeController(disable = true): ClassDecorator {
    if (process.env.NODE_ENV === 'development') {
        return createClassDecorator(DECORATORS.API_EXCLUDE_CONTROLLER, [false]);
    }
    if (process.argv.includes('--only-generate-swagger')) {
        return createClassDecorator(DECORATORS.API_EXCLUDE_CONTROLLER, [false]);
    }
    return createClassDecorator(DECORATORS.API_EXCLUDE_CONTROLLER, [disable]);
}
