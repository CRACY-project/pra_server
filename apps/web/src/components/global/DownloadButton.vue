<template>
    <ArrowDownTrayIcon
        v-show="data"
        class="h-7 w-7 text-primary-500 hover:cursor-pointer hover:text-primary-600 dark:text-tertiary-700 dark:hover:text-tertiary-600"
        aria-hidden="true"
        data-testid="download-csv"
        @click="downloadCSV"
    />
</template>
<script setup lang="ts">
    import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline';
    import { notify } from '@kyvg/vue3-notification';

    interface IProps {
        title?: string;
        data?: any;
        downloadCsvName?: string;
    }

    const props = withDefaults(defineProps<IProps>(), {
        title: 'Download',
        data: null,
        downloadCsvName: 'data',
    });

    function downloadCSV(): void {
        const csvContent: string = convertToCSV(props.data);
        if (csvContent != null) {
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', props.downloadCsvName + '.csv');
            link.click();
        }
    }

    function convertToCSV(data: any): string {
        if (data == null || data.length == 0 || data == undefined) {
            notify({
                text: 'No data to download',
                type: 'error',
            });
            return null as any;
        }
        const keys: string[] = [];

        let header = '';
        let rows = '';
        for (const row of data) {
            for (const key in row) {
                if (keys.indexOf(key) == -1) {
                    keys.push(key);
                    header += key + ';';
                }
            }
        }
        for (const row of data) {
            for (const key in keys) {
                if (keys[key] == 'company') {
                    rows += row[keys[key]].displayName;
                } else if (keys[key] == 'networkIsolationUsers') {
                    rows += row[keys[key]].length;
                } else if (row[keys[key]] == undefined) {
                    rows += '';
                } else if (keys[key] === 'Notes') {
                    rows += '"';
                    rows += row[keys[key]].replace(/"/gm, '""');
                    rows += '"';
                } else {
                    rows += row[keys[key]];
                }
                rows += ';';
            }
            rows += '\n';
        }
        let returnText = header + '\n' + rows;
        returnText = returnText.replace(/(;$)/gm, '');
        return returnText;
    }
</script>
