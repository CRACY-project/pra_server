<template>
    <div class="relative">
        <svg width="39" height="41" viewBox="0 0 39 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M17.8245 34.1683C25.9026 34.1683 32.4513 27.6197 32.4513 19.5416C32.4513 11.4634 25.9026 4.91479 17.8245 4.91479C9.74637 4.91479 3.19775 11.4634 3.19775 19.5416C3.19775 27.6197 9.74637 34.1683 17.8245 34.1683Z"
                fill="#59C3C3"
                stroke="white"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M17.6562 34.3125C26.8552 34.3125 34.3125 26.8552 34.3125 17.6562C34.3125 8.45726 26.8552 1 17.6562 1C8.45726 1 1 8.45726 1 17.6562C1 26.8552 8.45726 34.3125 17.6562 34.3125Z"
                stroke="#111279"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M17.6563 34.3125C22.982 34.3125 27.2994 26.8552 27.2994 17.6562C27.2994 8.45726 22.982 1 17.6563 1C12.3305 1 8.01318 8.45726 8.01318 17.6562C8.01318 26.8552 12.3305 34.3125 17.6563 34.3125Z"
                stroke="#111279"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path d="M17.6567 1.12012V34.1924" stroke="#111279" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M34.1924 17.6562H1.12012" stroke="#111279" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M31.8151 8.84155H3.51025" stroke="#111279" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M31.8151 25.8342H3.51025" stroke="#111279" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div
            class="absolute left-5 top-5 h-5 w-5 overflow-hidden rounded-full border border-tertiary-600 bg-white dark:bg-dark-700"
        >
            <slot name="favicon" />
        </div>
    </div>
</template>

<script setup lang="ts"></script>
