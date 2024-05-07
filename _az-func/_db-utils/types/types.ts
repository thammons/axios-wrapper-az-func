export const ContainerTypes = ["clients", "users"] as const;
export type ContainerType = (typeof ContainerTypes)[number];

export type IDataType =
  | "client"
  | "webuser";

export interface IContainerItem {
  data: {
    type: IDataType;
    creationUserName: string;
  };
  id?: string;
}

export type QueryMappingTypes =
  | "GetAllByType"
  | "GetAllWebUsers"
  | "GetByIds"
  | "GetById"
  | "GetByName"
  | "GetWebUserByUsername"
  | "GetWebUserByClient"
  | "GetByFirstNameLastName"
  | "GenericQuery"
  | undefined;

export interface IQueryParam {
  name: string;
  value: string | number | Boolean | null;
}

export interface IQueryMapping {
  name: QueryMappingTypes;
  query: string;
  params: IQueryParam[];
}
