import { v4 as randomUUID } from "uuid";
import dataStore from "./file-datastore.js"

import { IContainerItem, IDataType, IExecutionContext, IQueryMapping, IQueryParam } from "../_db-utils/index.js";
import { IDBEntity, IDBWebUser } from "./models/index.js";


export class FileContext implements IExecutionContext {
    async getContainer(containerName: string): Promise<IExecutionContext> {
        return Promise.resolve(this);
    }

    private getParamValues = (queryParams: IQueryParam[], name: string, index: number = -1): string[] => {
        const params = queryParams.filter(i => i.name.indexOf(name) > -1);
        if (!params || !params.length) throw new Error(`getParam: no param found for name: ${name}`);
        if (index > -1) {
            if (params.length <= index) throw new Error(`getParam: index out of range for name: ${name}`);
            return [params[index].value!.toString()];
        }
        return params.map(i => i.value!.toString());
    };

    private getParamValue = (queryParams: IQueryParam[], name: string, index: number = -1): string => {
        const params = this.getParamValues(queryParams, name, index);
        if (!params || !params.length) throw new Error(`getParam: no param found for name: ${name}`);
        if (params.length > 1) throw new Error(`getParam: multiple params found for name: ${name}`);

        return params[0];
    };

    queryContainer = async <T extends IContainerItem>(query: IQueryMapping): Promise<T[]> => {
        let results: IDBEntity[] = [];
        const queryParams = query.params;
        const dataType = this.getParamValue(queryParams, '@type', 0) as IDataType;
        if (!dataType) return Promise.reject({ status: 400, message: `runQuery: no dataType found in queryParams` });
        switch (query.name) {
            case "GetAllByType":
                results = dataStore.getDataByType(dataType);
                break;
            case "GetAllWebUsers":
                results = dataStore.getDataByType(dataType);
                break;
            case "GetByIds":
                results = dataStore.getDataByType(dataType).filter(item => queryParams.some(param => param.value == item.id));
                break;
            case "GetById":
                const items = dataStore.getDataByType(dataType).filter(item => queryParams.some(param => param.value == item.id));
                if (items.length > 1) return Promise.reject({ status: 400, message: `runQuery: multiple items found for id: ${items[0].id}` });
                results = [items[0]];
                break;
            case "GetWebUserByUsername":
                const username = this.getParamValue(queryParams, '@username');
                if (dataType != "webuser") return Promise.reject({ status: 400, message: `runQuery: GetWebUserByUsername not supported for dataType: ${dataType}` });
                const webUserData = dataStore.getDataByType(dataType) as IDBWebUser[];
                results = webUserData.filter(item => item.username == username);
                break;
            case "GetByName":
                const name = this.getParamValue(queryParams, '@name');
                const optionData = dataStore.getDataByType(dataType);
                const optionsMatches = optionData.filter(item => item.name == name);
                results = optionsMatches;
                break;
            default:
                return Promise.reject({ status: 400, message: `runQuery: unknown query: ${query}` });

        };
        return Promise.resolve(results as unknown as T[]);
    };

    executeQuery = async <T extends IContainerItem>(querymapping: IQueryMapping): Promise<T[] | undefined> => {
        //danger zone! Test this...
        const results = await this.queryContainer(querymapping);
        return Promise.resolve(results as unknown as T[]);
    };

    createItem = async <T extends IContainerItem>(item: T): Promise<T> => {
        if (!item) return Promise.reject({ status: 400, message: `create: no item provided!` });
        const dataType = item?.data.type as IDataType;
        item.id = randomUUID();
        dataStore.addItems(dataType, [item as unknown as IDBEntity]);
        return Promise.resolve(item);
    };

    createItems = async <T extends IContainerItem>(items: T[]): Promise<T[]> => {
        if (!items) return Promise.reject({ status: 400, message: `createBulk: no items provided!` });
        items.forEach(i => i.id = randomUUID());
        items.map(i => i.data.type as IDataType).forEach(dataTypeBulk => {
            dataStore.addItems(dataTypeBulk, items.filter(i => i.data.type == dataTypeBulk) as unknown as IDBEntity[]);
        });
        return Promise.resolve(items);

    };

    updateItemById = async <T extends IContainerItem>(item: T, id: string): Promise<T> => {
        if (!item) return Promise.reject({ status: 400, message: `updateItemById: no item provided!` });
        if (!id) return Promise.reject({ status: 400, message: `updateItemById: no id provided!` });
        const dataType = item?.data.type as IDataType;
        const existingItem = dataStore.getDataByType(dataType).find(i => i.id == id);
        if (!existingItem) return Promise.reject({ status: 404, message: `updateItemById: no item found for id: ${id}` });
        item.id = id;
        dataStore.updateItems(dataType, [item as unknown as IDBEntity]);
        return Promise.resolve(item);
    }

    upsertItem = async <T extends IContainerItem>(item: T): Promise<T> => {
        return await this.updateItemById(item, item.id!).catch(() => this.createItem(item));
    }

    getByPk = async <T extends IContainerItem>(id: string, type: IDataType): Promise<T> => {
        if (!id) return Promise.reject({ status: 400, message: `getByPk: no id provided!` });
        if (!type) return Promise.reject({ status: 400, message: `getByPk: no type provided!` });
        const item = dataStore.getDataByType(type).find(i => i.id == id);
        if (!item) return Promise.reject({ status: 404, message: `getByPk: no item found for id: ${id}` });
        return Promise.resolve(item as unknown as T);
    };

    deleteItem(id: string, type: IDataType): Promise<any> {
        throw new Error("Method not implemented.");
    }
};