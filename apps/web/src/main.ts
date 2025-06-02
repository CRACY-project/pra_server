import './assets/main.css';

import { applicationIcons, genesisIcons } from '@formkit/icons';
import { createInput, defaultConfig as defaultFormKitConfig, plugin as formKitPlugin } from '@formkit/vue';
import Notifications from '@kyvg/vue3-notification';
import { createApp } from 'vue';

import CustomText from '@/components/global/inputs/CustomText.vue';
import { msalInstance } from '@/config';
import { msalPlugin } from '@/plugins/msal';
import { installPinia } from '@/plugins/pinia';
import {
    emailValidation,
    fileSizeValidation,
    fileTypeValidation,
    sameValueValidation,
    tagEmailValidation,
    tagMaxLengthValidation,
    tagMinLengthValidation,
    uniqueValidation,
    urlValidation,
} from '@/validation';

import App from './App.vue';
import ToggleField from './components/global/inputs/ToggleField.vue';
import { formKitConfig } from './plugins/formkit.config';
import router from './router';

const app = createApp(App);
app.use(
    formKitPlugin,
    defaultFormKitConfig({
        inputs: {
            toggle: { type: 'input', component: ToggleField },
            textClip: createInput(CustomText, { type: 'input' }),
        },
        icons: { ...applicationIcons, ...genesisIcons },
        config: formKitConfig,
        rules: {
            tagMinLengthValidation,
            tagMaxLengthValidation,
            tagEmailValidation,
            urlValidation,
            emailValidation,
            sameValueValidation,
            uniqueValidation,
            fileTypeValidation,
            fileSizeValidation,
        },
        messages: {
            en: {
                validation: {
                    hostnameValidation: 'Invalid hostname',
                    ipAddressValidation: 'Invalid IP address',
                    isNetworkAddressIpRangeValidation:
                        'The IP address in the CIDR notation should be a network address.',
                    tagMinLengthValidation({ args }) {
                        return `Tag must be at least  ${args[0]} characters`;
                    },
                    tagMaxLengthValidation({ args }) {
                        return `Tag must be at most ${args[0]} characters`;
                    },
                    tagEmailValidation: 'Invalid email address',
                    urlValidation: 'Invalid URL',
                    tagHostnameValidation: 'Invalid hostname',
                    emailValidation: 'Invalid email address',
                    mobileHostnameValidation: 'Invalid hostname',
                    sameValueValidation: 'Input does not match',
                    uniqueValidation: 'Value already exists',
                    domainValidation: 'Invalid URL',
                    fileTypeValidation: 'Invalid file type',
                    fileSizeValidation: 'File size exceeds maximum allowed size',
                },
            },
        },
    })
);
installPinia(app);
app.use(router);

app.use(Notifications);
app.use(msalPlugin, msalInstance);
app.mount('#app');
