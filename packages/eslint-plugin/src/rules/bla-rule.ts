import { TSESLint } from '@typescript-eslint/utils';

type MessageIds = 'noBlaUsed';

const rule: TSESLint.RuleModule<MessageIds> = {
    defaultOptions: [],
    meta: {
        docs: {
            description: 'This rule is run on typescript!',
        },
        messages: {
            noBlaUsed: 'All variables should be named "bla"!',
        },
        type: 'suggestion',
        fixable: 'code',
        schema: [], // no options
    },
    create: context => {
        return {
            VariableDeclarator: node => {
                if (node.id.type === 'Identifier' && node.id.name !== 'bla') {
                    context.report({
                        node,
                        messageId: 'noBlaUsed',
                    });
                }
            },
        };
    },
};

export default rule;
