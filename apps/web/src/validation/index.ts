import isEmail from 'validator/lib/isEmail';

export interface IAllowService {
    id: number;
    srcGroup: string;
    dstPortStart: string;
    dstPortEnd: string;
    dstId: number;
    protocol: string;
    description: string;
    type: string;
    note: string;
    disabled: boolean;
}

export const tagMinLengthValidation = (tags: any, min: number) => {
    let valid = true;
    tags.value.forEach((tag: string) => {
        if (!(tag.length >= min)) valid = false;
    });
    return valid;
};

export const tagMaxLengthValidation = (tags: any, max: number) => {
    let valid = true;
    tags.value.forEach((tag: string) => {
        if (!(tag.length <= max)) valid = false;
    });
    return valid;
};

export const tagEmailValidation = (tags: any) => {
    let valid = true;
    tags.value.forEach((tag: string) => {
        if (!isEmail(tag)) valid = false;
    });
    return valid;
};

export const urlValidation = (node: any) => {
    try {
        new URL(node.value);
        return true;
    } catch {
        return false;
    }
};

export const emailValidation = (node: any) => {
    return isEmail(node.value);
};

export const sameValueValidation = (node: any, value: string) => {
    return node.value === value;
};

export const uniqueValidation = (node: any, arr: string[]) => {
    if (arr.includes(node.value)) {
        return false;
    }
    return true;
};

export const fileTypeValidation = (node: any, supportedTypes: string[]) => {
    for (const file of node.value) {
        if (!supportedTypes.includes(file.file.type)) return false;
    }
    return true;
};

export const fileSizeValidation = (node: any, maxFileSize: number) => {
    for (const file of node.value) {
        const fileSize = file.file.size / (1000 * 1000);
        if (fileSize > maxFileSize) return false;
    }
    return true;
};
