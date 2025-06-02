import { ClassSerializerInterceptor, Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { existsSync, readFileSync, writeFileSync } from 'fs';

import { DtoFilterInterceptor } from '@/common/interceptors/dto-filter.interceptor';
import {
    PrismaClientExceptionFilter,
    PrismaClientExceptionFilterValidationError,
} from '@/common/prisma-client-exception/prisma-client-exception.filter';
import { getSwaggerServersForEnvironment } from '@/modules/swagger/swagger';

import { AppModule } from './app.module';
import { PDETokenHeaderValue } from './modules/auth/strategies/pde-token.strategy';

async function bootstrap(onlyGenerateSwagger = false) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('query parser', 'extended');
    app.enableShutdownHooks();
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
    });
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: false,
            validateCustomDecorators: true,
        })
    );
    app.useGlobalInterceptors(new DtoFilterInterceptor());
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    app.useGlobalFilters(new PrismaClientExceptionFilterValidationError(httpAdapter));

    const config = new DocumentBuilder()
        .setTitle('Cracy PDE API')
        .setDescription('API for the Cracy PDE')
        .setVersion('1.0.0')
        .addBearerAuth({ bearerFormat: 'JWT', type: 'http', scheme: 'bearer' })
        .addApiKey({ type: 'apiKey', 'x-tokenName': PDETokenHeaderValue, in: 'header' }, PDETokenHeaderValue);

    const swaggerServers = getSwaggerServersForEnvironment(process.env.ENVIRONMENT || 'development');
    for (const server of swaggerServers) {
        config.addServer(server);
    }
    const openApiDocument = config.build();
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string, version?: string) => {
            return `${methodKey}${version?.toUpperCase()}`;
        },
    };
    const document = SwaggerModule.createDocument(app, openApiDocument, options);
    const swaggerCSS = readFileSync('./src/modules/swagger/swagger.css').toString();
    const swaggerOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'SASE API Docs',
        customCss: swaggerCSS,
    };
    const swaggerJSON = JSON.stringify(document);
    if (!existsSync('./swagger.json') || swaggerJSON !== readFileSync('./swagger.json').toString()) {
        Logger.warn('swagger.json is not up to date... updating...');
        writeFileSync('./swagger.json', swaggerJSON);
    }
    if (onlyGenerateSwagger) {
        Logger.warn('Only generating swagger.json... quitting...');
        await app.close();
        return;
    }

    SwaggerModule.setup('/docs', app, document, swaggerOptions);
    await app.listen(process.env.PORT ?? 4001);
}

const onlyGenerateSwagger = process.argv.includes('--only-generate-swagger');
bootstrap(onlyGenerateSwagger).catch(() => {});
