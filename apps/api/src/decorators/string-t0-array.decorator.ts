export const stringToArray = ({ value }: { value: any }): any => {
    if (typeof value === 'string') {
        return value.split(',');
    }
    return value;
};
