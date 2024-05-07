import type { IDBClient } from "./db-client.js";
import type { IDBWebUser } from "./db-webuser.js";

export type IDBEntity = IDBClient | IDBWebUser;

export type { ContainerItem } from "./db-container-item.js";
export type { IDBClient, IClient } from "./db-client.js";
export type { IDBWebUser, IWebUser, WebUserRole } from "./db-webuser.js";
export { WebUserRoles } from "./db-webuser.js";
