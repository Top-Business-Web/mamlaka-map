import http, { type IHttp } from '@/plugins/axios';

interface IStats {
  id?: number;
}

class Stats {
  constructor(private http: IHttp) {}

  async getAll(params: Record<string, string>) {
    let url = 'stats';
    // for (const key in params) {
    //   if (url.includes('?')) {
    //     url = `${url}&${key}=${params[key]}`
    //   } else {
    //     url = `${url}?${key}=${params[key]}`
    //   }
    // }

    return await this.http.get(url);
  }
}

export default new Stats(http);
