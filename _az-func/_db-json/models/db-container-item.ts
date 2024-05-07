import type { IContainerItem, IDataType } from "../../_db-utils/types/types.js";

export class ContainerItem implements IContainerItem {
  data: { type: IDataType; creationUserName: string };

  constructor(type: IDataType, userName: string) {
    this.data = { type: type, creationUserName: userName };
  }
}
