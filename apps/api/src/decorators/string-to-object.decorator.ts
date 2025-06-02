export const stringToObject = ({ value }) => {
    if (typeof value === 'string') {
        return JSON.parse(value);
    }
    return value;
};
