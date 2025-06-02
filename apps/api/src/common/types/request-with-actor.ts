import { Request } from 'express';

export interface IActor {
    id: number;
    name: string;
    type: string;
}

export interface RequestWithActor extends Request {
    actor: IActor;
    refreshToken?: string;
}
