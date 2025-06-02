import myFirstRule from './rules/bla-rule';
import dangerousMatches from './rules/dangerous-matches';

const rules = {
    'my-first-rule': myFirstRule,
    'dangerous-matches': dangerousMatches,
};

// export default rules;
// export { rules };
export = {
    rules,
};
