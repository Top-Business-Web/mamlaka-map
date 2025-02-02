import Auth from './modules/auth';

export interface IAPI {
  Auth: typeof Auth;
}

const API: IAPI = {
  Auth
};

export default API;
