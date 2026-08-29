import type { Request, Response } from "express";
import type { PassportStatic } from "passport";
import type { AuthenticateReturn } from "graphql-passport";
import type { HydratedDocument } from "mongoose";
import type { IUser, IUserMethods } from "../models/user.model.js";

export type AuthUser = HydratedDocument<IUser, IUserMethods>;

export interface GraphQLContextParams {
  req: Request;
  res: Response;
  passport: PassportStatic;
}

export interface GraphQLContext {
  req: Request;
  res?: Response;
  getUser: () => AuthUser | undefined;
  login: (user: AuthUser, options?: object) => Promise<void>;
  logout: (options?: object) => Promise<void>;
  authenticate: (
    strategyName: string,
    options?: object
  ) => Promise<AuthenticateReturn<AuthUser>>;
}
