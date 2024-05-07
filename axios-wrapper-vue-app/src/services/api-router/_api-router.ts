import { useAppStore } from '@/stores/appStore';
import devApiWait from '@/services/appLogic/dev-api-wait';
import axios from 'axios';

interface Response {
  data?: any;
  error?: {
    message?: string;
    code: number;
  };
}

async function getApi(prepResponse?: (resp: any) => any) {
  await devApiWait();

  const baseUrl = import.meta.env.VITE_FUNC_URL ?? '';
  const api = axios.create({
    baseURL: baseUrl, // + 'api/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.response.use(
    async (response) => {
      //console.log('api interceptors response', response);
      if (!!prepResponse) {
        return { data: applyToOneOrAll(response.data.data, prepResponse) };
      }

      if (response?.data && response?.data !== '') {
        return response.data;
      }
      return response;
    },
    (error) => {
      console.error('ApiRouter handleError:', error);
      //console.trace("unhandled error", error);
      if (error?.response?.status === 401) {
        const appStore = useAppStore();
        appStore.logout();
      }

      const err = error.response?.data?.error ?? error;
      console.error('ApiRouter error:', err);
      return Promise.reject(err);
    }
  );
  return api;
}

const applyToOneOrAll = (data: any, func: ((d: any) => any) | undefined) => {
  let response = data;
  if (!!func && Array.isArray(data)) {
    response = data.map(func);
  } else if (!!func) {
    response = func(data);
  }
  //console.log('applyToOneOrAll', response);
  return response;
};

export default function ApiRouter(
  url: string, //FunctionRoutes
  prepRequestItem?: (req: any) => any,
  prepResponseItem?: (resp: any) => any
) {
  return {
    get: () => getApi(prepResponseItem).then((api) => api.get(url)),

    getByQueryParams: (params: any) => {
      //remove undefined values
      let cleanParams: any = {};
      for (const key in params) {
        if (params[key] !== undefined) {
          cleanParams[key] = params[key];
        }
      }
      return getApi(prepResponseItem).then((api) => {
        const searchParams = new URLSearchParams(cleanParams);
        const resp = api.get(url + '?' + searchParams.toString());
        return resp;
      }) as Promise<Response>;
    },
    post: (data: any) => {
      const reqData = applyToOneOrAll(data, prepRequestItem);
      return getApi(prepResponseItem).then((api) =>
        api.post(url, reqData)
      ) as Promise<Response>;
    },
    put: (data: any) => {
      const reqData = applyToOneOrAll(data, prepRequestItem);
      return getApi(prepResponseItem).then((api) =>
        api.put(url, reqData)
      ) as Promise<Response>;
    },
    upsert: (isCreate: boolean, data: any) =>
      isCreate
        ? (ApiRouter(url, prepRequestItem, prepResponseItem).post(
            data
          ) as Promise<Response>)
        : (ApiRouter(url, prepRequestItem, prepResponseItem).put(
            data
          ) as Promise<Response>),

    delete: (id: string) =>
      getApi(prepResponseItem).then((api) =>
        api.delete(url + '?id=' + id)
      ) as Promise<Response>,
  };
}
