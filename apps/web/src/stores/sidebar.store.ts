import { useDark } from '@vueuse/core';
import { defineStore } from 'pinia';

import type { ISection } from '@/components/sidebar';

interface IState {
    isCollapsed: boolean;
    showDropdown: boolean;
    isDark: boolean;
    sectionVisibility: { [key: string]: boolean };
    selectedSection: string;
    prevSelectedSection: string;
}

export const useSidebarStore = defineStore('sidebar', {
    state: (): IState => {
        return {
            isCollapsed: false,
            showDropdown: false,
            isDark: useDark().value,
            sectionVisibility: {},
            selectedSection: '',
            prevSelectedSection: '',
        };
    },
    actions: {
        setIsCollapsed() {
            this.isCollapsed = !this.isCollapsed;
        },
        setShowDropdown() {
            if (this.isCollapsed) {
                this.showDropdown = !this.showDropdown;
            }
        },
        setIsDark() {
            this.isDark = !this.isDark;
        },
        toggleSectionVisibility(section: ISection) {
            this.sectionVisibility[section.name] = !this.sectionVisibility[section.name];
        },
        setSelectedSection(sectionName: string) {
            this.selectedSection = sectionName;
        },
        setPrevSelectedSection(sectionName: string) {
            this.prevSelectedSection = sectionName;
        },
    },
    persist: true,
});
