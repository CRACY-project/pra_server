import { RuleTester } from '@typescript-eslint/rule-tester';
import myRule from './bla-rule';

const ruleTester = new RuleTester({});

ruleTester.run('bla-rule', myRule, {
    valid: ['const bla = "two"', 'const bla = 2'],
    invalid: [
        {
            code: 'const foo = "two"',
            errors: [{ messageId: 'noBlaUsed' }],
        },
    ],
});
