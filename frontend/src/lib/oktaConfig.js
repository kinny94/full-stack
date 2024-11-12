export const oktaConfig = {
    clientId: '0oajzen8gySwFjozG5d7',
    issuer: 'https://dev-53658902.okta.com/oauth2/default',  // Added /oauth2/default
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true, // Not recommended for production,
    useInteractionCodeFlow: false,
    useClassicEngine: true,
}