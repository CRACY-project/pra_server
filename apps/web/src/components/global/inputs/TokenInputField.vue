<template>
    <p
        class="text-md mb-2 block font-medium"
        :class="`text-gray-700 ${props.darkModeSupport ? 'dark:text-gray-300' : 'dark:text-gray-700'}`"
        for="token"
    >
        Your verification code has been sent to your email
    </p>
    <div class="token flex w-full" @input="handleTokenInput">
        <input
            v-for="(field, index) in fields"
            :key="field"
            ref="inputs"
            v-model="data[index]"
            :data-index="index"
            type="number"
            inputmode="numeric"
            maxlength="1"
            class="focus:ring-none mr-2 h-10 w-10 rounded border text-center caret-black [appearance:textfield] focus:outline-none dark:bg-dark-500 dark:caret-white dark:autofill:!bg-dark-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            :class="{
                '!text-dark-200': !props.darkModeSupport,
                '!caret-black': !props.darkModeSupport,
                'dark:bg-white dark:text-dark-200 dark:hover:bg-white': !props.darkModeSupport,
            }"
            @paste="handlePaste($event)"
            @input="checkInput($event)"
            @keydown="handleKeydown($event)"
        />
    </div>
</template>

<script lang="ts" setup>
    import { onMounted, onUnmounted, ref, watch } from 'vue';

    const props = defineProps<{
        fields: number;
        modelValue: number | string;
        darkModeSupport: boolean;
    }>();

    const data = ref<string[]>(new Array(props.fields).fill(''));
    const inputs = ref([]);
    const emit = defineEmits(['update:modelToken', 'submit']);

    watch(
        () => data.value,
        newToken => {
            const checkedToken = newToken.map(token => token[0] ?? '');
            emit('update:modelToken', Number(checkedToken.join('')));
        },
        { deep: true }
    );

    const handleTokenInput = (e: Event) => {
        const inputEvent = e as InputEvent;
        const target = inputEvent.target as HTMLInputElement;
        if (inputEvent.data && target.nextElementSibling instanceof HTMLInputElement) {
            target.nextElementSibling.focus();
        } else if (inputEvent.data == null && target.previousElementSibling instanceof HTMLInputElement) {
            target.previousElementSibling.focus();
        }
    };

    const checkInput = (e: Event) => {
        const inputEvent = e as InputEvent;
        const target = inputEvent.target as HTMLInputElement;
        const index = parseInt(target.dataset.index ?? '');
        if (!isNaN(index) && inputEvent.data) {
            const char = inputEvent.data.charAt(0); // Only take the first character
            target.value = char;
            if (index >= 0 && index < data.value.length) {
                data.value[index] = char; // Safely update the model with the valid index
            }
            if (target.nextElementSibling instanceof HTMLInputElement) {
                target.nextElementSibling.focus();
            }
        }
    };

    onMounted(() => {
        document.addEventListener('paste', handlePaste);
        const target = inputs.value[0] as HTMLInputElement;
        target.focus();
    });

    onUnmounted(() => {
        document.removeEventListener('paste', handlePaste);
    });

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();

        const text = e.clipboardData?.getData('text')?.replace(/\s+/g, '');
        let pasteData = parseInt(text ?? '').toString();
        pasteData = pasteData.slice(0, props.fields);

        data.value = pasteData.split('');
        emit('update:modelToken', Number(parseInt(pasteData)));

        const lastElement = pasteData.length === props.fields ? pasteData.length - 1 : pasteData.length;
        const target = inputs.value[lastElement] as HTMLInputElement;
        target.focus();
    };

    const handleArrowRight = (e: KeyboardEvent) => {
        e.preventDefault();

        const target = e.target as HTMLInputElement;
        if (target.nextElementSibling instanceof HTMLInputElement) {
            target.nextElementSibling.focus();
        }
    };

    const handleArrowLeft = (e: KeyboardEvent) => {
        e.preventDefault();

        const target = e.target as HTMLInputElement;
        if (target.previousElementSibling instanceof HTMLInputElement) {
            target.previousElementSibling.focus();
        }
    };

    const handleBackspace = (e: KeyboardEvent) => {
        e.preventDefault();

        const target = e.target as HTMLInputElement;
        const index = parseInt(target.dataset.index ?? '');

        if (target.value === '') {
            data.value[index - 1] = '';
        }

        let nextElement = target.nextElementSibling;
        let nextElementIndex = index + 1;

        while (nextElement instanceof HTMLInputElement) {
            if (nextElement instanceof HTMLInputElement) {
                data.value[nextElementIndex - 1] = nextElement.value;
                data.value[nextElementIndex] = '';
            }
            nextElement = nextElement.nextElementSibling;
            nextElementIndex++;
        }

        if (!(target.nextElementSibling instanceof HTMLInputElement)) {
            data.value[index] = '';
        }

        if (target.previousElementSibling instanceof HTMLInputElement) {
            target.previousElementSibling.focus();
        }
    };

    const handleEnter = () => {
        if (data.value.length === props.fields) {
            emit('submit');
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Backspace') {
            handleBackspace(e);
        } else if (e.key === 'Enter') {
            handleEnter();
        } else if (e.key === 'ArrowRight') {
            handleArrowRight(e);
        } else if (e.key === 'ArrowLeft') {
            handleArrowLeft(e);
        } else if (!(e.ctrlKey && e.key === 'v') && isNaN(Number(e.key))) {
            e.preventDefault();
        }
    };
</script>
