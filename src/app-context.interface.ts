import { Request, Response } from 'express';

export interface AppContext {
  req: Request & { session: { userId: string } };
  res: Response;
}
