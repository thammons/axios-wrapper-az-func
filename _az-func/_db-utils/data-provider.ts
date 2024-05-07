import queryBuilder, { type QueryBuilder } from "./query-builder.js";
import type {
  ContainerType,
  IContainerItem,
  IDataType,
  IDBProvider,
  IExecutionContext,
  IQueryMapping,
} from "./types/index.js";

export class DataProvider implements IDBProvider {
  _queryBuilder: QueryBuilder;
  _execContext: IExecutionContext;
  // _validator: Validate;

  constructor(
    execContext: IExecutionContext,
    // validator: Validate
  ) {
    this._execContext = execContext;
    this._queryBuilder = queryBuilder;
    //   this._validator = validator;
  }


  switchContext = async (dbContextName: ContainerType): Promise<void> => {
    this._execContext = await this._execContext.getContainer(dbContextName);

    console.debug("switched context to", dbContextName);
  };

  create = async <T extends IContainerItem>(item: T): Promise<T> => {
    // await this._validator.validateForCreate(item);
    return await this._execContext.createItem<T>(item);
  };

  createBulk = async <T extends IContainerItem>(
    items: T[],
    bulkChunkSize: number = 5
  ): Promise<T[]> => {
    try {
    //   const createdItems = (await this._validator.validateForBulkCreate(
    //     items
    //   )) as unknown as T[];

      return await this._execContext.createItems<T>(
        // createdItems,
        items,
        bulkChunkSize
      );
    } catch (err: any) {
      console.error("create bulk error", err);
      return Promise.reject({
        status: 400,
        message: "Bulk create failed. " + err.message,
      });
    }
  };

  update = async <T extends IContainerItem>(
    item: T,
    id: string
  ): Promise<T> => {
    if (item == undefined) {
      return Promise.reject({
        status: 400,
        message: "Update requires an item to be passed in!",
      });
    }
    if (id == undefined) {
      return Promise.reject({
        status: 400,
        message: "Update requires an id to be passed in!",
      });
    }
    return await this._execContext.updateItemById<T>(item, id);
  };

  upsert = async <T extends IContainerItem>(item: T): Promise<T> => {
    if (item == undefined) {
      return Promise.reject({
        status: 400,
        message: "Upsert requires an item to be passed in!",
      });
    }
    if (item.id == undefined) {
      return Promise.reject({
        status: 400,
        message: "Upsert requires an id to be passed in!",
      });
    }
    if (item.data.type == undefined) {
      return Promise.reject({
        status: 400,
        message: "Upsert requires a type to be passed in!",
      });
    }
    return await this._execContext.upsertItem<T>(item);
  };

  getById = async <T extends IContainerItem>(
    type: IDataType,
    id: string
  ): Promise<T> => {
    if (!id) {
      return Promise.reject({
        status: 400,
        message: "GetByPk requires an id to be passed in!",
      });
    }
    if (!type) {
      return Promise.reject({
        status: 400,
        message: "GetByPk requires a type to be passed in!",
      });
    }
    return await this._execContext.getByPk<T>(id, type);
  };

  queryContainer = async <T extends IContainerItem>(
    query: IQueryMapping
  ): Promise<T[]> => {
    if (!query || !query.query) {
      return Promise.reject({
        status: 400,
        message: "Query requires a query to be passed in!",
      });
    }
    return await this._execContext.queryContainer<T>(query);
  };

  getAllByType = async <T extends IContainerItem>(
    type: IDataType
  ): Promise<T[]> => {
    const query = this._queryBuilder.getAllByType(type);
    return await this.queryContainer(query);
  };

  getAllWebUsers = async <T extends IContainerItem>(
    pedigreeName: string
  ): Promise<T[]> => {
    const query = this._queryBuilder.getAllWebUsers(pedigreeName);
    return await this.queryContainer(query);
  };

  getByIds = async <T extends IContainerItem>(
    type: IDataType,
    ids: string[]
  ): Promise<T[]> => {
    const query = this._queryBuilder.getByIds(type, ids);
    return await this.queryContainer<T>(query);
  };

  getByName = async <T extends IContainerItem>(
    type: IDataType,
    name: string
  ): Promise<T[]> => {
    const query = this._queryBuilder.getByName(type, name);
    return await this.queryContainer(query);
  };

  getByFirstLastName = async <T extends IContainerItem>(
    type: IDataType,
    name: string,
    lastName?: string
  ): Promise<T[]> => {
    const query = this._queryBuilder.getByFirstLastName(type, name, lastName);
    return await this.queryContainer(query);
  };

  getWebUserByUserName = async <T extends IContainerItem>(
    pedigreeName: string,
    userName: string
  ): Promise<T[]> => {
    const query = this._queryBuilder.getWebUserByUsername(
      pedigreeName,
      userName
    );
    return await this.queryContainer(query);
  };

  deleteItem = async (id: string, type: IDataType): Promise<any> => {
    return await this._execContext.deleteItem(id, type);
  };
}
