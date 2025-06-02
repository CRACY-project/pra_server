import { admins } from '../../../config';
export interface IUserWithCompany {
    email: string;
    company: {
        connect: {
            name: string;
        };
    };
    password?: string;
}
export const users: IUserWithCompany[] = [];

admins.forEach(admin => {
    users.push({
        email: admin,
        company: { connect: { name: 'Jimber' } },
    });
});
