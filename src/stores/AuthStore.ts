import { defineStore } from 'pinia';
import http from '@/plugins/axios';
import { ENUMS } from '@/config';
// import vuetify from '@/plugins/vuetify';
// import i18n, { type Locale } from '@/plugins/i18n';
// import API from '@/services/api';

export interface User {
  name: string;
}

interface AuthState {
  user: User | Promise<User> | null;
  loginToken: string | null;
  verificationToken: string | null;
  otpResendDurationLeft: number;
}

export const useAuthStore = defineStore('AuthStore', {
  state: (): AuthState => ({
    user: null,
    loginToken: null,
    verificationToken: null,
    otpResendDurationLeft: 120
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.loginToken;
    },
    isVerified(state) {
      return !!state.verificationToken && !!state.user;
    }
  },
  actions: {
    async login(username: string, password: string) {
      delete http.defaults.headers.common.Authorization;
      return await http.post('auth/login', { username, password });
    },
    async verifyOtp(otp: string) {
      http.defaults.headers.common.Authorization = `Bearer ${this.loginToken}`;
      return await http.post('auth/verify-otp', { otp });
    },
    async logout() {
      try {
        await http.post('auth/logout');

        this.setLoginToken(null);
        this.setVerificationToken(null);
        this.setUser(null);
        this.setOtpDuration(120);

        setTimeout(() => {
          location.reload();
        }, 300);
      } catch (err) {
        console.error(err);
      }
    },
    initStore() {
      const loginToken = localStorage.getItem(ENUMS['APP_LOGIN_TOKEN']);
      const verificationToken = localStorage.getItem(ENUMS['APP_VERIFICATION_TOKEN']);
      const userInfo = localStorage.getItem(ENUMS['APP_USER_INFO']);
      const otpResendDuration = localStorage.getItem(ENUMS['OTP_RESEND_DURATION']);

      if (loginToken) {
        this.loginToken = loginToken;
      }

      if (verificationToken) {
        this.verificationToken = verificationToken;
      }

      if (userInfo) {
        this.user = JSON.parse(userInfo);
      }

      if (otpResendDuration) {
        this.otpResendDurationLeft = parseInt(otpResendDuration);
      }

      console.log('%cTafweej AuthStore initilized!', 'color:green;font-weight:bold');
    },
    setUser(user: User | null) {
      user
        ? localStorage.setItem(ENUMS['APP_USER_INFO'], JSON.stringify(user))
        : localStorage.removeItem(ENUMS['APP_USER_INFO']);
      this.user = user;
    },
    setLoginToken(token: string | null) {
      token && token?.trim()
        ? localStorage.setItem(ENUMS['APP_LOGIN_TOKEN'], token)
        : localStorage.removeItem(ENUMS['APP_LOGIN_TOKEN']);
      this.loginToken = token;
    },
    setVerificationToken(token: string | null) {
      token && token?.trim()
        ? localStorage.setItem(ENUMS['APP_VERIFICATION_TOKEN'], token)
        : localStorage.removeItem(ENUMS['APP_VERIFICATION_TOKEN']);
      this.verificationToken = token;
    },
    setOtpDuration(duration: number = 120) {
      duration
        ? localStorage.setItem(ENUMS['OTP_RESEND_DURATION'], JSON.stringify(duration))
        : localStorage.removeItem(ENUMS['OTP_RESEND_DURATION']);
      this.otpResendDurationLeft = duration;
    }
  }
});
