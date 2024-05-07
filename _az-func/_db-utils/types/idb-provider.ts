import type {
  ContainerType,
  IContainerItem,
  IDataType,
  IQueryMapping,
} from "./types.js";

export interface IDBProvider {
  switchContext(dbContextName: ContainerType): Promise<void>;
  create<T extends IContainerItem>(item: T): Promise<T>;
  createBulk<T extends IContainerItem>(
    items: T[],
    bulkChunkSize?: number
  ): Promise<T[]>;
  update<T extends IContainerItem>(item: T, itemId: string): Promise<T>;
  //TODO: probably use upsert instead of update
  upsert<T extends IContainerItem>(item: T): Promise<T>;
  getAllWebUsers<T extends IContainerItem>(pedigreeName: string): Promise<T[]>;
  getAllByType<T extends IContainerItem>(type: IDataType): Promise<T[]>;
  getById<T extends IContainerItem>(type: IDataType, id: string): Promise<T>;
  getByIds<T extends IContainerItem>(
    type: IDataType,
    ids: string[]
  ): Promise<T[]>;
  getByName<T extends IContainerItem>(
    type: IDataType,
    name: string
  ): Promise<T[]>;
  getByFirstLastName<T extends IContainerItem>(
    type: IDataType,
    name: string,
    lastName?: string
  ): Promise<T[]>;
  getWebUserByUserName<T extends IContainerItem>(
    pedigreeName: string,
    userName: string
  ): Promise<T[]>;

  queryContainer<T extends IContainerItem>(query: IQueryMapping): Promise<T[]>;
  deleteItem(id: string, type: IDataType): Promise<any>;
}
