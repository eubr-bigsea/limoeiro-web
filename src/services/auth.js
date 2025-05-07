import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const IDENTITY_CONFIG = {
    authority: import.meta.env.VITE_AUTH_URL + "/oauth2/authorize",
    client_id: import.meta.env.VITE_IDENTITY_CLIENT_ID,
    client_secret: import.meta.env.VITE_IDENTITY_CLIENT_SECRET,
    redirect_uri: import.meta.env.VITE_REDIRECT_URL,
    response_type: "code", 
    scope: "openid profile",
    webAuthResponseType: "id_token token",
    loadUserInfo: true,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    metadata: {
        issuer: import.meta.env.VITE_AUTH_URL,
        authorization_endpoint: import.meta.env.VITE_AUTH_URL + "/oauth2/authorize",
        token_endpoint: import.meta.env.VITE_AUTH_URL + "/oauth2/token",
        userinfo_endpoint: import.meta.env.VITE_AUTH_URL + "/oauth2/userinfo",
        end_session_endpoint: import.meta.env.VITE_AUTH_URL + "/oidc/logout",
    }
};

class AuthService {
    constructor() {
        this.userManager = new UserManager(IDENTITY_CONFIG);
    }

    async login() {
        return this.userManager.signinRedirect();
    }

    async logout() {
        return this.userManager.signoutRedirect();
    }

    async handleCallback() {
        return this.userManager.signinRedirectCallback();
    }

    async isAuthenticated() {
        const user = await this.getUser();
        return !!user && !user.expired;
    }

    async getUser() {
        return this.userManager.getUser();
    }

    async clearStaleState() {
        await this.userManager.clearStaleState();
    }
}

export const authService = new AuthService();