import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import CrudButton from './CrudButton.vue';

describe('CrudButton', () => {
    it('should render the slot correctly', () => {
        const wrapper = mount(CrudButton, { slots: { default: 'hello world' } });
        expect(wrapper.html()).toContain('hello world');
    });
});
