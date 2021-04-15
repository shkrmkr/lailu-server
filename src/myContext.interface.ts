import { Request, Response } from 'express';

export interface MyContext {
  req: Request & { session: { userId: string } };
  res: Response;
}
