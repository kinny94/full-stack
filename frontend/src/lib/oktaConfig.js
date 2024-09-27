export const oktaConfig = {
    clientId: 'CULBaI8cbHGS8Uu5twjs7upNgCtCma8O',
    issuer: 'https://dev-gtkw07f7bz84x264.us.auth0.com/oath2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: [
        'openid', 'profile', 'email'
    ],
    pkce: true,
    disableHttpsCheck: true,
}