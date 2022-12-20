import type { IronSession, IronSessionData } from 'iron-session';

export interface SessionData extends IronSessionData {
  user: { isLoggedIn: true };
}

export type CustomIronSession = IronSession & SessionData;
