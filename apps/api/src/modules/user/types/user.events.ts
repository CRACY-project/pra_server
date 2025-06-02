import { UserWithRelations } from './user.types';

export const UserEvent = {
    CREATED: 'user.created',
    UPDATED: 'user.updated',
    DELETED: 'user.deleted',
} as const;

export interface UserUpdatedEvent {
    oldUser: UserWithRelations;
    user: UserWithRelations;
    actor: string;
}
export interface UserCreatedEvent {
    user: UserWithRelations;
    actor: string;
}
export interface UserDeletedEvent {
    user: UserWithRelations;
    actor: string;
}
