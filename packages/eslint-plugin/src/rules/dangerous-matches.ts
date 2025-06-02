import { TSESLint } from '@typescript-eslint/utils';
import { ReportDescriptor } from '@typescript-eslint/utils/ts-eslint';
type MessageIds = 'noMaxLengthFound';

const rule: TSESLint.RuleModule<MessageIds> = {
    defaultOptions: [],
    meta: {
        docs: {
            description: 'disallow Matches decorator without MaxLength decorator',
        },
        type: 'suggestion',
        messages: {
            noMaxLengthFound: 'Matches decorator should be followed by MaxLength decorator',
        },
        fixable: 'code',
        schema: [], // no options
    },
    create: context => {
        return {
            Decorator: node => {
                if (
                    node.expression.type === 'CallExpression' &&
                    node.expression.callee.type === 'Identifier' &&
                    node.expression.callee.name === 'Matches'
                ) {
                    const parentNode = node.parent as any;
                    const decorators = parentNode.decorators || [];
                    const matchesIndex = decorators.indexOf(node);
                    let maxLengthIndex = -1;
                    let maxLengthNode: any;
                    for (let i = 0; i < decorators.length; i++) {
                        const decorator = decorators[i];
                        if (
                            decorator.expression.type === 'CallExpression' &&
                            decorator.expression.callee.type === 'Identifier' &&
                            decorator.expression.callee.name === 'MaxLength'
                        ) {
                            maxLengthIndex = i;
                            maxLengthNode = decorator;
                        }
                    }

                    if (maxLengthIndex > matchesIndex) {
                        return;
                    }

                    const report: ReportDescriptor<MessageIds> = {
                        node,
                        messageId: 'noMaxLengthFound',
                        fix: fixer => {
                            const sourceCode = context.sourceCode;

                            const lines = sourceCode.getText().split('\n');
                            const nodeLine = lines[node.loc.start.line - 1]; // Get the full line of the decorator
                            const indentation = nodeLine.match(/^\s*/)?.[0] || ''; // Extract leading spaces/tabs

                            const maxLengthText = maxLengthNode
                                ? `\n${indentation}${sourceCode.getText(maxLengthNode)}`
                                : `\n${indentation}@MaxLength(MAX_LENGTH)`;

                            const fixes = [fixer.insertTextAfter(node, maxLengthText)];

                            if (maxLengthNode) {
                                const sourceCode = context.sourceCode;
                                const maxLengthLineRange = sourceCode.getIndexFromLoc({
                                    line: maxLengthNode.loc.start.line,
                                    column: 0,
                                });
                                const nextLineRange = sourceCode.getIndexFromLoc({
                                    line: maxLengthNode.loc.end.line + 1,
                                    column: 0,
                                });

                                fixes.push(fixer.removeRange([maxLengthLineRange, nextLineRange]));
                            }
                            return fixes;
                        },
                    };

                    context.report(report);
                }
            },
        };
    },
};

export default rule;
