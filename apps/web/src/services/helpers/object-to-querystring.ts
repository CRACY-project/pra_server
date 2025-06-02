export const objectToQueryString = (obj: { [index: string]: any }) => {
    const keyValuePairs = [];
    for (const key in obj) {
        if (obj[key] === undefined) continue;
        // if object is an array, we need to encode the key as an array
        // e.g. { roles: ['ADMIN', 'USER'] } => roles[]=ADMIN&roles[]=USER
        if (Array.isArray(obj[key])) {
            obj[key].forEach((value: any) => {
                keyValuePairs.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(value));
            });
            continue;
        }
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
    return keyValuePairs.join('&');
};
