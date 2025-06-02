<template>
    <div class="flex h-full flex-row items-center justify-center">
        <div class="flex flex-col dark:text-gray-300">
            <div class="flex w-[50vw] flex-col items-center">
                <h2 class="mb-1 text-[30px] font-bold">{{ entityType }} cannot be configured</h2>
                <h5 class="text-gray-500">
                    <slot name="message">
                        To enable {{ entityType }},
                        <template v-if="mainDependencies.length > 0"
                            >{{ dependenciesToString(mainDependencies, 'main') }} must be set up</template
                        >
                        <template v-if="mainDependencies.length > 0 && otherDependencies?.length">, and </template>
                        {{
                            otherDependencies?.length
                                ? `at least one of the following needs to be configured: ${dependenciesToString(otherDependencies, 'other')}.`
                                : '.'
                        }}
                    </slot>
                </h5>
                <br />
                <template v-if="showLinks">
                    <div v-if="mainDependencies.length" class="my-3 flex w-[50vw] flex-col gap-3 border-y py-3">
                        <CanNotBeConfiguredEntry
                            v-for="dependency in mainDependencies"
                            :key="dependency.name"
                            :dependency="dependency"
                        />
                    </div>
                    <div v-if="otherDependencies?.length" class="flex w-[50vw] flex-col">
                        <h5 class="text-gray-500" :class="mainDependencies.length ? '' : 'mt-3 border-t pt-3'">
                            Configure one of the following:
                        </h5>
                        <div class="my-3 flex flex-col gap-3 border-y py-3">
                            <CanNotBeConfiguredEntry
                                v-for="dependency in otherDependencies"
                                :key="dependency.name"
                                :dependency="dependency"
                            />
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { type Dependency } from './cannot-be-configured.types';

    withDefaults(
        defineProps<{
            entityType: string;
            mainDependencies: Dependency[];
            otherDependencies?: Dependency[];
            showLinks?: boolean;
        }>(),
        {
            showLinks: true,
            otherDependencies: undefined,
        }
    );

    const dependenciesToString = (dependencies: Dependency[], type: string) => {
        const names = dependencies.map(dependency => dependency.name);
        let dependencyString = '';

        for (let i = 0; i < names.length; i++) {
            if (i !== 0) {
                dependencyString += ', ';
            }

            if (i === names.length - 1 && names.length > 1) {
                dependencyString += type === 'main' ? 'and ' : 'or ';
            }

            dependencyString += names[i];
        }

        return dependencyString;
    };
</script>
