import { reactive } from 'vue';

export default function usePagination(defaultItemsPerPage = 400) {
    return reactive({
        skip: 0,
        take: defaultItemsPerPage,
        totalItems: 0,
        filteredItems: 0,
        page: 1,
        nextPage() {
            this.skip += this.take;
            this.page++;
        },
        previousPage() {
            this.skip = Math.max(0, this.skip - this.take);
            this.page--;
        },
        reset() {
            this.skip = 0;
        },
    });
}
