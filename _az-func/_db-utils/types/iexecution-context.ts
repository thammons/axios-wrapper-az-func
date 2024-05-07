import type {
  ContainerType,
  IContainerItem,
  IDataType,
  IQueryMapping,
} from "./types.js";

export interface IExecutionContext {
  //new (dbSettings: dbConfigSetting): IExecutionContext;
  getContainer(dbContextName: ContainerType): Promise<IExecutionContext>;
  createItem<T extends IContainerItem>(item: T): Promise<T>;
  upsertItem<T extends IContainerItem>(item: T): Promise<T>;
  updateItemById<T extends IContainerItem>(item: T, id: string): Promise<T>;
  createItems<T extends IContainerItem>(
    items: T[],
    startChunkSize: number
  ): Promise<T[]>;
  queryContainer<T extends IContainerItem>(query: IQueryMapping): Promise<T[]>;
  getByPk<T extends IContainerItem>(id: string, type: IDataType): Promise<T>;
  deleteItem(id: string, type: IDataType): Promise<any>;
}
