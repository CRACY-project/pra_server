import { UserCompanyRoleValue, type UserDto } from '@cracy/typescript-client';
import { notify } from '@kyvg/vue3-notification';
import moment from 'moment';

export const generateUsersTable = (users: UserDto[]) => {
    return users.map((user: UserDto) => {
        return {
            ...user,
            company: user.company ? user.company.name : 'No company',
            enabled: user.userRoles
                ? user.userRoles.some(role => role.value === UserCompanyRoleValue.COMPANYADMIN)
                : false,
        };
    });
};

export const getRandomBytes = (length: number): string => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const generateToken = (length: number) => {
    return getRandomBytes(length)
        .toString()
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
};

export const copyToClipboard = ({ text, subject }: { text: string; subject: string }) => {
    navigator.clipboard.writeText(text).then(
        () => {
            notify({
                text: `${subject} copied to clipboard`,
                type: 'success',
                ignoreDuplicates: true,
            });
        },
        err => {
            console.error('Could not copy text: ', err);
        }
    );
};

export const copyDevInfo = (environment: any, device: any) => {
    let info = `| Key      | Value |\n| ------------- |:-------------:|\n`;
    Object.entries({ ...environment, ...device }).forEach(([key, value]) => {
        if (key === 'date') {
            value = new Date((value as unknown as number) * 1000).toString();
        }

        info += `| ${key} | ${value} |\n`;
    });

    copyToClipboard({ text: info, subject: 'Developer Info' });
};

export const mapToObject = (map: Map<any, any>) => Object.fromEntries(map.entries());

export const cleanTextForCSV = (text: string) => {
    return text.includes('\n') ? `"${text}"` : text;
};

export const getFavIconOfSite = (url: string) => {
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
};

export const formatDate = (date: Date) => {
    return moment(date).format('ll LTS');
};

export const isNotDefaultDate = (date: Date) => {
    const defaultDate = new Date(0);
    return date.getTime() !== defaultDate.getTime();
};

export const formatCamelCaseToTitleCase = (text: string) => {
    const uppercaseWords = [
        'WAN',
        'LAN',
        'DNS',
        'ID',
        'IP',
        'URL',
        'UTC',
        'OS',
        'CPU',
        'IO',
        'PID',
        'PPID',
        'CWD',
        'EXE',
        'MAC',
    ];

    return text
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .split(' ')
        .map(word => {
            if (uppercaseWords.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};

export const formatSnakeCaseToTitleCase = (text: string) => {
    return text
        .split('_')
        .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
};
