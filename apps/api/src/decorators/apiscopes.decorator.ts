import { SetMetadata } from '@nestjs/common';

import { ApiTokenScope } from '@/common/guards/api.key.guard';

export const API_SCOPES_KEY = 'api_scopes';
export const ApiScope = (scope: ApiTokenScope) => SetMetadata(API_SCOPES_KEY, scope);
