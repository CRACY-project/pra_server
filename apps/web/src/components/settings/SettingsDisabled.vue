<template>
    <div
        class="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-gradient-radial from-gray-200 to-transparent backdrop-blur-[2px] dark:from-gray-900"
    >
        <!-- Centered Content -->
        <div class="text-2xl font-semibold text-primary-500 dark:text-gray-300">
            <slot></slot>
        </div>

        <div>
            <slot name="text"></slot>
        </div>
    </div>
</template>
