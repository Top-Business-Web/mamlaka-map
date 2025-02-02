import http, { type IHttp } from '@/plugins/axios';
// import { LoginForm, RegisterForm } from "@/validations";
import { type User } from '@/stores/AuthStore';
import { useAuthStore } from '@/stores/AuthStore';
// import { useNotifyStore } from "@/stores/notify";
// import { toast } from "vue3-toastify";

interface LoginResponse {
  user: User;
  token: string;
}

interface UpdateAccountPayload {
  name: string;
  email: string;
}

interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

class Auth {
  constructor(private http: IHttp) {}

  // loading() {
  //     return toast.loading(
  //         'Please wait...',
  //         { position: 'bottom-center',  },
  //     );
  // }

  async login(credentials: Record<string, string | number>): Promise<{ data: LoginResponse }> {
    const response = await this.http.post('auth/login', credentials);
    // toast.success(`<strong>Logged In successfully</strong>`);

    return response;
  }

  async register(payload: Record<string, string | number>): Promise<LoginResponse> {
    return await this.http.post('auth/register', payload);
  }

  async me(): Promise<{ data: { data: User } }> {
    // const id = this.loading()
    const response = await this.http.get('auth/me');
    // toast.remove(id);

    return response;
  }

  async updateAccount(payload: UpdateAccountPayload): Promise<LoginResponse> {
    return await this.http.post('auth/me/update', payload);
  }

  async changePassword(payload: ChangePasswordPayload): Promise<LoginResponse> {
    return await this.http.post('auth/me/change-password', payload);
  }

  async logout() {
    await this.http.post('auth/logout');
    useAuthStore().setToken(null);
    location.reload();
  }
}

export default new Auth(http);
