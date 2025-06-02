import { RuleTester } from '@typescript-eslint/rule-tester';
import dangerousMatches from './dangerous-matches';

const ruleTester = new RuleTester({});
ruleTester.run('dangerous-matches-rule', dangerousMatches, {
    valid: [
        {
            name: 'should work with a simple class',
            code: `
            export class CreateDomainDto {
                name: string;
            }`,
        },
        {
            name: 'should work',
            code: `
            class CreateDomainDto {
                @hello(20)
                name: string;
            }
            `,
        },
        {
            name: 'maxlength is present after matches',
            code: `
            class CreateDomainDto {
                @Matches(/^/, { message: 'Domain name is not a valid domain' })
                @MaxLength(20)
                name: string;
            }
            `,
        },
    ],
    invalid: [
        {
            name: 'should fail because MaxLength is not present',
            code: `
        import { Matches } from 'class-validator';
        const woo = /^/;
        export class CreateDomainDto {
            @Matches(woo, { message: 'Domain name is not a valid domain' })
            name: string;
        }`,
            output: `
        import { Matches } from 'class-validator';
        const woo = /^/;
        export class CreateDomainDto {
            @Matches(woo, { message: 'Domain name is not a valid domain' })
            @MaxLength(MAX_LENGTH)
            name: string;
        }`,
            errors: [{ messageId: 'noMaxLengthFound' }],
        },
        {
            name: 'should fail because MaxLength is not present after Matches',
            code: `
        import { Matches } from 'class-validator';
        const woo = /^/;
        export class CreateDomainDto {
            @MaxLength(20)
            @Matches(woo, { message: 'Domain name is not a valid domain' })
            name: string;
        }`,
            output: `
        import { Matches } from 'class-validator';
        const woo = /^/;
        export class CreateDomainDto {
            @Matches(woo, { message: 'Domain name is not a valid domain' })
            @MaxLength(20)
            name: string;
        }`,
            errors: [{ messageId: 'noMaxLengthFound' }],
        },
    ],
});
