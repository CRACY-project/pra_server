import type { FormKitClasses, FormKitConfig, FormKitNode, FormKitPlugin, FormKitSectionsSchema } from '@formkit/core';
import type { FormKitInputProps, FormKitInputs } from '@formkit/inputs';
import { generateClasses } from '@formkit/themes';
import { cloneAny } from '@formkit/utils';

declare module '@formkit/inputs' {
    interface FormKitInputProps<Props extends FormKitInputs<Props>> {
        toggle: {
            type: 'toggle';
            value?: boolean;
        };
        textClip: {
            type: 'textClip';
            value?: string | number;
        };
    }
}

export type FormKitInputType = FormKitInputProps<any>[keyof FormKitInputProps<any>]['type'];

export function emptyStringBecomesNull(node: FormKitNode) {
    node.hook.input((value, next) => {
        if (value === '') {
            return next(null);
        }
        return next(value);
    });
}

export const formKitConfig: Partial<FormKitConfig> = {
    classes: <Record<string, FormKitClasses>>generateClasses({
        global: {
            outer: '',
            label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
            help: 'text-sm text-gray-500 dark:text-gray-100 mt-1',
            messages: 'list-none p-0 mt-1 mb-0',
            message: 'text-red-500 mb-1 text-sm',
            input: '\
             caret-black dark:caret-white dark:autofill:!bg-dark-500 \
             dark:bg-dark-500 \
             disabled:cursor-not-allowed disabled:opacity-60 \
             focus:outline-none focus:ring-none focus:outline-none appearance-none',
            fieldset: 'max-w-md border border-gray-300 rounded px-2 pb-1',
            inner: 'disabled:cursor-not-allowed disabled:pointer-events-none flex items-center',
            legend: 'font-bold text-sm',
            loaderIcon: 'inline-flex items-center w-4 text-gray-600 animate-spin',
            prefixIcon:
                'w-10 flex self-stretch grow-0 shrink-0 rounded-tl rounded-bl border-r border-gray-300 bg-white bg-gradient-to-b from-transparent to-gray-200 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto',
            suffixIcon:
                'w-7 pr-3 p-3 flex self-stretch grow-0 shrink-0 [&>svg]:w-full [&>svg]:max-w-[1em] [&>svg]:max-h-[1em] [&>svg]:m-auto bg-red-500',
            emptyMessage: 'dark:bg-dark-500',
        },
        'family:dropdown': {
            dropdownWrapper:
                'my-2 w-full shadow-lg rounded [&::-webkit-scrollbar]:hidden border bg-white dark:bg-dark-500',
            emptyMessageInner:
                'flex items-center justify-center text-sm p-2 text-center w-full text-gray-500 [&>span]:mr-3 [&>span]:ml-0',
            inner: 'relative flex ring-gray-400 rounded-md \
                    border bg-white \
                    dark:bg-dark-500  dark:ring-gray-600\
                    formkit-disabled:focus-within:ring-gray-400 formkit-disabled:focus-within:ring-1 \
                    [&>span:first-child]:focus-within:text-blue-500 text-sm  flex items-center',
            input: 'w-full px-3 py-2',
            listbox: '',
            listboxButton: 'flex w-12 self-stretch justify-center mx-auto',
            listitem:
                'space-x-2 relative hover:bg-gray-200 dark:bg-dark-500 \
                data-[is-active="true"]:bg-gray-200 dark:data-[is-active="true"]:bg-dark-400 \
                data-[is-active="true"]:aria-selected:bg-primary-500 aria-selected:bg-primary-500 aria-selected:text-white \
                dark:data-[is-active="true"]:aria-selected:bg-dark-900 dark:aria-selected:bg-dark-900',
            loaderIcon: 'ml-auto',
            loadMoreInner:
                'flex items-center justify-center text-sm p-2 text-center w-full text-blue-500 formkit-loading:text-gray-500 cursor-pointer [&>span]:mr-3 [&>span]:ml-0',
            option: 'p-2 cursor-default select-none',
            optionLoading: 'text-gray-500',
            placeholder: 'p-2 text-gray-400',
            selector: 'flex w-full justify-between items-center [&u] disabled:opacity-50 disabled:cursor-not-allowed',
            selectedIcon: 'block absolute top-1/2 left-2 w-3 -translate-y-1/2',
            selectIcon: 'flex box-content w-4 px-2 self-stretch grow-0 shrink-0 [&>svg]:w-[1em] cursor-pointer',
        },
        'family:button': {
            input: '$reset inline-flex items-center bg-blue-600 text-white text-sm font-normal rounded focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 formkit-disabled:bg-gray-400 formkit-loading:before:w-4 formkit-loading:before:h-4 formkit-loading:before:mr-2 formkit-loading:before:border formkit-loading:before:border-2 formkit-loading:before:border-r-transparent formkit-loading:before:rounded-3xl formkit-loading:before:border-white formkit-loading:before:animate-spin',
            prefixIcon: '$reset block w-4 -ml-2 mr-2 stretch',
            suffixIcon: '$reset block w-4 ml-2 stretch',
        },
        button: {
            outer: 'mb-0',
            input: 'bg-primary-500 hover:bg-primary-300 text-white text-sm font-medium px-4 py-2 border border-transparent rounded-md dark:bg-tertiary-700 dark:hover:bg-tertiary-600',
        },
        submit: {
            outer: 'mb-0',
            input: 'inline-flex items-center justify-center bg-primary-500 dark:bg-tertiary-700 dark:hover:bg-tertiary-600 w-full hover:bg-primary-300 hover text-white text-sm font-medium px-4 py-2 border border-transparent rounded-md shadow-sm disabled:cursor-not-allowed disabled:dark:hover:bg-gray-400',
        },
        text: {
            input: 'border-gray-300 dark:border-dark-200 block w-full sm:text-sm dark:text-gray-300 rounded-md focus:border-primary-500 dark:focus:border-primary-400',
        },
        select: {
            input: 'block w-full sm:text-sm   dark:text-gray-300 rounded-md ',
            selectIcon: 'flex p-[3px] shrink-0 w-5 -ml-[1.5em] h-full pointer-events-none [&>svg]:w-[1em]',
            option: 'formkit-multiple:p-3 formkit-multiple:text-sm text-sm text-regular text-gray-700 dark:text-gray-300',
        },
        email: {
            input: 'block w-full sm:text-sm   dark:text-gray-300 rounded-md',
        },
        form: {
            messages: 'px-6',
        },
        number: {
            input: 'sm:text-sm w-full border-gray-300 dark:border-dark-200 dark:text-gray-300 rounded-md',
        },
        password: {
            input: 'block w-full sm:text-sm border-gray-300 dark:border-dark-200 dark:text-gray-300 rounded-md  ',
        },
        textarea: {
            input: 'block w-full sm:text-sm border-gray-300 dark:border-dark-200 dark:text-gray-300 rounded-md',
        },
        file: {
            inner: 'flex items-center border border-gray-300 dark:border-dark-200 rounded-md px-3 py-2 bg-white dark:bg-dark-500 cursor-pointer',
            outer: 'block w-full mb-3',
            input: 'w-full text-sm text-gray-700 dark:text-gray-300 bg-transparent border-0 focus:outline-none focus:ring-0 dark:placeholder-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-primary-500 file:text-white hover:file:bg-primary-600 dark:file:bg-tertiary-700 dark:hover:file:bg-tertiary-600 shadow-none',
            fileItem: 'flex items-center justify-between text-sm text-gray-800 dark:text-gray-300 mb-1',
            removeFiles: 'text-primary-500 hover:text-primary-600 text-sm',
            fileRemove: 'hidden',
            fileName: 'hidden',
            noFiles: 'hidden',
        },
        date: {
            input: 'block w-full sm:text-sm dark:text-gray-300 border-gray-300 dark:border-dark-200 rounded-md',
        },
        time: {
            label: 'pl-1',
            help: 'pt-1 pl-1',
            input: 'block w-full sm:text-sm border-gray-300 dark:border-dark-200 rounded-md',
            outer: 'w-full',
        },
        'datetime-local': {
            input: 'block w-full sm:text-sm dark:text-gray-300 border-gray-300 dark:border-dark-200 rounded-md',
        },
        checkbox: {
            fieldset: 'block w-full border-none border-gray-300 rounded-md pb-2 pl-0',
            legend: 'mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ',
            wrapper: 'flex cursor-pointer content-center items-center',
            help: 'my-2',
            input: 'form-check-input text-primary-500 dark:text-tertiary-700 h-5 w-5 border border-primary  rounded-md focus:outline-none focus:ring-0 transition duration-200 disabled:cursor-not-allowed',
            label: 'text-sm text-gray-700 mb-0 ',
            inner: 'flex',
            options: 'space-y-2',
        },
        radio: {
            fieldset: 'block w-full border-none border-gray-300 rounded-full pb-2 pl-0',
            legend: 'mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ',
            wrapper: 'flex cursor-pointer content-center items-center',
            help: 'my-2',
            input: 'form-check-input text-primary-500 dark:text-tertiary-700 h-5 w-5 mr-2 border border-primary  rounded-full focus:outline-none focus:ring-0 transition duration-200 disabled:cursor-not-allowed',
            label: 'text-sm text-gray-700 !mb-0 ',
            inner: 'flex',
            options: 'space-y-2',
        },
        dropdown: {
            tagsWrapper: 'max-w-[calc(100%_-_35px)]',
            tags: 'flex items-center flex-wrap gap-1 mx-2',
            tag: 'flex items-center rounded-full bg-gray-200 text-xs text-black py-1 px-2.5 cursor-default',
            tagLabel: 'px-1',
            selectionsWrapper: 'flex w-[calc(100%_-_35px)] overflow-hidden ',
            selections: 'inline-flex items-center px-2.5',
            selectionsItem: 'whitespace-nowrap mr-1 last:mr-0 py-5',
            option: 'truncate pr-0 pl-4',
            listitem: 'py-0',
            truncationCount:
                'flex items-center whitespace-nowrap justify-center rounded text-white bg-gray-500 font-bold text-xs px-1 py-0.5',
            removeSelection: 'block w-2.5 my-1 cursor-pointer',
            selectionWrapper: 'overflow-hidden',
        },
        autocomplete: {
            closeIcon: 'block grow-0 shrink-0 w-3 mr-3.5',
            selectionsWrapper: 'flex w-[calc(100%_-_35px)] overflow-hidden ',
            selections: 'inline-flex items-center px-2.5',
            selectionsItem: 'whitespace-nowrap mr-1 last:mr-0 py-2',
            inner: '[&>div>[data-value]]:absolute [&>div>[data-value]]:mb-0',
            option: 'break-words whitespace-normal pr-4 pl-4',
            input: 'w-full p-2 border-none focus:outline-none sm:text-sm rounded-md',
        },
        toggle: {
            altLabel: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-full',
            inner: '$reset inline-block mr-2',
            input: 'peer absolute opacity-0 pointer-events-none border-none',
            innerLabel: 'text-[10px] font-bold absolute left-full top-1/2 -translate-x-full -translate-y-1/2 px-1',
            thumb: 'relative left-0 aspect-square rounded-full transition-all w-5 bg-white h-5',
            track: 'p-0.5 min-w-[3em] relative rounded-full transition-all bg-gray-200 dark:bg-dark-900 peer-checked:bg-primary-500 dark:peer-checked:bg-tertiary-700 peer-checked:[&>div:last-child]:left-full peer-checked:[&>div:last-child]:-translate-x-full peer-checked:[&>div:first-child:not(:last-child)]:left-0 peer-checked:[&>div:first-child:not(:last-child)]:translate-x-0',
            valueLabel: 'font-bold text-sm w-full',
            wrapper: 'flex flex-row-reverse items-center mb-1',
            label: 'w-full',
        },
        taglist: {
            input: 'px-1 py-1 border-none outline-none !focus:shadow-none flex-grow !w-auto focus:border-none  focus:ring-offset-0 focus:ring-0',
            removeSelection: 'min-w-[10px] mx-1 self-center text-black leading-none',
            tag: 'flex items-center my-1 p-1 bg-gray-200 rounded-full \
                 \
                  dark:bg-tertiary-700 dark:text-gray-100',
            tagWrapper:
                'mr-1 focus:outline-none focus:text-white [&>div]:focus:bg-blue-500 [&>div>button]:focus:text-white truncate',
            tagLabel: 'pl-2 pr-0 truncate',
            tags: 'flex items-center flex-wrap px-1 w-full truncate',
            listItem: 'disabled:opacity-50 p-2',
            closeIcon: 'dark:text-gray-100',
            listbox: 'cursor-default select-none',
            option: 'pl-5 cursor-pointer',
        },
    }),
};

export function stripString(node: FormKitNode) {
    node.hook.input((value, next) => {
        if (typeof value === 'string' || value instanceof String) return next(value.trim());
        return next(value);
    });
}

export function reloadDropdown(node: FormKitNode) {
    if (node.props.type === 'dropdown') {
        node.on('prop:options', ({ origin }) => {
            node.input(origin.props.activeValue);
        });
    }
}

export function createTooltipInputPlugin(): FormKitPlugin {
    return (node: FormKitNode) => {
        node.on('created', () => {
            if (!node.props || !node.props.definition || !node.context) return;

            const tooltip = node.props.attrs.tooltip;
            if (!tooltip) return;

            const inputDefinition = cloneAny(node.props.definition);
            if (!inputDefinition) return;

            const originalSchema = inputDefinition.schema;
            if (typeof originalSchema !== 'function') return;

            const isMultiOption = (node.props.type === 'checkbox' || node.props.type === 'radio') && node.props.options;

            const higherOrderSchema = (extensions: FormKitSectionsSchema) => {
                extensions[isMultiOption ? 'legend' : 'label'] = {
                    if: 'true',
                    attrs: {
                        class: '$classes.label + " flex"',
                    },
                    children: [
                        '$label',
                        {
                            $cmp: 'Tooltip',
                            children: tooltip,
                            props: { class: 'ml-1' },
                        },
                    ],
                };

                return originalSchema(extensions);
            };

            inputDefinition.schema = higherOrderSchema;
            if (inputDefinition.schemaMemoKey) {
                inputDefinition.schemaMemoKey += '-input-tooltip' + Math.random().toString(36).substring(7);
            }
            node.props.definition = inputDefinition;
        });
    };
}

export function enterOnBlur(node: FormKitNode) {
    node.on('created', () => {
        if (node.props.type !== 'taglist' || !node.context || !node.props.allowNewValues) return;

        const blur = node.context.handlers.blur;

        node.context.handlers.blur = e => {
            if (node.props.inputText && !e?.relatedTarget) {
                node.input([...((node.value as any) || []), node.props.inputText]);
            }

            blur(e);
        };

        const keydown = node.context.handlers.keydown;

        node.context.handlers.keydown = e => {
            if ((e.key === 'Enter' || e.key === ' ' || e.key === ',') && node.props.inputText) {
                e.preventDefault();

                node.input([...((node.value as any) || []), node.props.inputText]);
            }

            keydown(e);
        };
    });
}
