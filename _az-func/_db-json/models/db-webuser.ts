import { IContainerItem } from "../../_db-utils/types/types.js";
import { IClient } from "./db-client.js";

export const WebUserRoles = ['admin', 'user'] as const;
export type WebUserRole = (typeof WebUserRoles)[number];

export interface IWebUser {
    id?: string;
    name: string;
    email: string;
    username: string;
    password: string;
    salt: string;
    roleType: WebUserRole;
    attempts: number;
    isApproved: boolean;
    isLocked: boolean;
    lastPasswordChanged?: Date;
    lastLogin?: Date;
    client: IClient;
}

export interface IDBWebUser extends IWebUser, IContainerItem {}