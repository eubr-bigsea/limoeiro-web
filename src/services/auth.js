import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const authUrl = import.meta.env.VITE_AUTH_URL;


const metadata = {
    issuer: authUrl + "/oauth2/token",
    jwks_uri: authUrl + "/oauth2/jwks",
    authorization_endpoint: authUrl + "/oauth2/authorize",
    token_endpoint: authUrl + "/oauth2/token",
    userinfo_endpoint: authUrl + "/oauth2/userinfo",
    end_session_endpoint: authUrl + "/oidc/logout",
    check_session_iframe: authUrl + "/oidc/checksession",
    revocation_endpoint: authUrl + "/oauth2/revoke",
    introspection_endpoint: authUrl + "/oauth2/introspect"

}

const config = {
    authority: `${authUrl}/oauth2/authorize`,
    metadata: metadata,
    client_id: import.meta.env.VITE_IDENTITY_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_REDIRECT_URL,
    login: authUrl + "/login",
    automaticSilentRenew: false, 
    loadUserInfo: true,
    responseType: "id_token token",
    grantType: "password",
    scope: 'openid profile',
    webAuthResponseType: "id_token token",
    userStore: new WebStorageStateStore({ store: window.localStorage })
};


class AuthService {
    constructor() {
        this.userManager = new UserManager(config);
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
}
export const authService = new AuthService();