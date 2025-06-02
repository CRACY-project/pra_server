export const stringToNum = ({ value }) => {
    if (typeof value === 'string' && !Number.isNaN(Number(value))) {
        return Number(value);
    }
    return value;
};
