import ApiRouter from './_api-router';

const getApi = () => ApiRouter('login');

export default {
  async authPing(pedigreeName: string, username: string) {
    const { data } = await getApi().getByQueryParams({ pedigreeName, username });
    //TODO Type Data? (its an expiration date)
    //console.log('authPing', data);
    return data;
  },
  async login(pedigreeName: string, username: string, password: string) {
    const { data } = await getApi().post({
      pedigreeName: pedigreeName,
      username: username,
      password: password,
    });
    //console.log('loginRoutes > login', data);
    return data;
  },
};
