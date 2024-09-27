import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import {BrowserRouter} from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Auth0Provider
        domain="dev-gtkw07f7bz84x264.us.auth0.com"
        clientId="CULBaI8cbHGS8Uu5twjs7upNgCtCma8O"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
    >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Auth0Provider>,
);
