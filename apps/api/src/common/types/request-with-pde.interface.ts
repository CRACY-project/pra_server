import { PDE } from '@cracy/database';
import { Request } from 'express';

export interface RequestWithPDE extends Request {
    pde: PDE;
}
