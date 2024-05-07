import { IContainerItem } from '../../_db-utils/types/types.js';

export interface IClient {
    id?: string;
    name: string;
}

export interface IDBClient extends IClient, IContainerItem {}
