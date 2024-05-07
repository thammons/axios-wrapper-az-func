

import data from './data-files/index.js';
import { IDataType } from '../_db-utils/types/types.js';
import { IDBClient, IDBEntity, IDBWebUser } from './models/index.js';

const convertToDbModel = <T extends IDBEntity>(items: any[]): T[] => {
    return items.map(item => JSON.parse(JSON.stringify(item)) as T);
};

export class DataStore {
    WebUsersData: IDBWebUser[];
    ClientsData: IDBClient[];

    constructor() {
        this.ClientsData = convertToDbModel<IDBClient>(data.ClientsData);
        this.WebUsersData = convertToDbModel<IDBWebUser>(data.WebUsersData);
    };

    getDataByType = (dataType: IDataType): IDBEntity[] => {
        switch (dataType) {
            case "client": return this.ClientsData;
            case "webuser": return this.WebUsersData;
            default: throw new Error(`getDataByType: unknown dataType: ${dataType}`);
        }
    };

    _dataActionByType = (dataType: IDataType, action: (items: IDBEntity[]) => IDBEntity[]) => {
        switch (dataType) {
            case "client":
                this.ClientsData = action(this.ClientsData) as IDBClient[];
                break;
            case "webuser":
                this.WebUsersData = action(this.WebUsersData) as IDBWebUser[];
                break;
            default: throw new Error(`getDataByType: unknown dataType: ${dataType}`);
        }
    };

    addItems = (dataType: IDataType, items: IDBEntity[]) => {
        this._dataActionByType(dataType, (data) => [...data, ...items]);
    };

    updateItems = (dataType: IDataType, items: IDBEntity[]) => {
        this._dataActionByType(dataType, (data) => {
            const removedItems = data.filter(item => !items.find(i => i.id == item.id));
            const newData = [...removedItems, ...items];
            return newData;
        });
    };
};

export default new DataStore();