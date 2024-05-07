import { ContainerType } from "./types.js";

export interface IJwtConfigSetting {
    secret: string;
    expirationSeconds: number;
  }
  export interface IDBConfigSetting {
    endpoint: string;
    key: string;
    databaseId: string;
    containerId: string;
    itemContainerId: string;
    partitionKey: { kind: string; paths: string[] };
    getContainerIdByType: (containerType: ContainerType) => string;
  }
export interface IConfigSettings {
    dbConfigSettings: IDBConfigSetting;
    jwtConfigSettings: IJwtConfigSetting;
  }