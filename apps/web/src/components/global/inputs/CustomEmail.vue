<template>
    <div class="flex w-full flex-row items-center gap-3">
        <FormKit
            type="text"
            name="username"
            :disabled="context.disabled"
            outer-class="flex-1 max-w-[50%]"
            :value="username"
            data-testid="email-username"
            @input="handleUsernameInput"
        />
        <p>@</p>
        <FormKit
            id="domain"
            type="select"
            name="domain"
            :disabled="context.disabled"
            outer-class="flex-1 max-w-[50%]"
            :options="context.attrs.domains ?? []"
            :value="domain"
            popover
            open-on-focus
            empty-message="No domains found"
            data-testid="email-domain"
            :deselect="false"
            @input="handleDomainChange"
        />
    </div>
    <ul class="mb-0 mt-1 list-none p-0">
        <li v-for="error of errors" :key="error" class="mb-1 text-sm text-red-500">{{ error }}</li>
    </ul>
</template>

<script lang="ts" setup>
    import { getNode } from '@formkit/core';
    import { onBeforeMount, ref, watch } from 'vue';

    interface IProps {
        context: any;
    }

    const props = defineProps<IProps>();

    const username = ref<string | undefined>();
    const domain = ref<string | undefined>();
    const errors = ref<string[]>([]);

    const handleUsernameInput = (value: string | undefined) => {
        username.value = value;

        mergeInputs();
    };

    const handleDomainChange = (value: any) => {
        domain.value = value;

        mergeInputs();
    };

    const mergeInputs = () => {
        const mergedInput = `${username.value ?? ''}@${domain.value}`;

        props.context.node.input(mergedInput);
    };

    onBeforeMount(() => {
        if (props.context._value) {
            const email = props.context._value.split('@');
            username.value = email[0];
            domain.value = email[1];

            mergeInputs();
        }
    });

    watch(
        () => ({ ...props.context.attrs }),
        () => {
            if (props.context._value) return;

            if (props.context.attrs.domains) {
                const node = getNode('domain');
                node?.input(props.context.attrs.domains[0]);
            }
        }
    );

    watch(
        () => ({ ...props.context.messages }),
        () => {
            if (!props.context.messages) return;

            const messages: string[] = [];
            for (const message of Object.values(props.context.messages) as any[]) {
                messages.push(message.value);
            }

            errors.value = messages;
        }
    );
</script>
