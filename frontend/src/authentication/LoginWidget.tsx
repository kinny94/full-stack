import { useOktaAuth } from "@okta/okta-react";
import { Spinner } from "../layouts/utils/Spinner";
import { redirect } from "react-router-dom";
import OktaSignInWidget from "./OktaSignInWidget";
import React from "react";

// @ts-ignore
const LoginWidget: React.FC<{config: any }> = (props) => {
    const { oktaAuth, authState } = useOktaAuth();

    const onSuccess = (tokens: any) => {  // Replace `any` with the specific token type from Okta SDK
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err: any) => {  // Replace `any` with the specific error type from Okta SDK
        console.log("Sign in error: ", err);
    };

    if (!authState) {
        return <Spinner />;
    }

    // @ts-ignore
    return authState.isAuthenticated ? (
        redirect("/home")
    ) : (
        <OktaSignInWidget config={props.config} onSuccess={onSuccess} onError={onError} />
    );
};

export default LoginWidget;