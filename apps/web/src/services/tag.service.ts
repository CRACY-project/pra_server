import { type DeleteTagV1Request, type GetTagsV1Request, TagsApi } from '@cracy/typescript-client';

import { ApiClientFactory } from './api.middlewares';

export function useTagService() {
    const apiClient = ApiClientFactory.createApiClient(TagsApi);

    async function getTags(params: GetTagsV1Request) {
        return await apiClient.getTagsV1(params);
    }

    async function deleteTag(params: DeleteTagV1Request) {
        return apiClient.deleteTagV1(params);
    }

    return { getTags, deleteTag };
}
