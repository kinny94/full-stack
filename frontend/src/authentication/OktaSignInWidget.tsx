import { useEffect, useRef } from "react";
import OktaSignIn from "@okta/okta-signin-widget";
import { oktaConfig } from "../lib/oktaConfig";

interface OktaSignInWidgetProps {
    config: any;
    onSuccess: (tokens: any) => void;  // Replace `any` with specific token type if known
    onError: (error: any) => void;  // Replace `any` with specific error type if known
}

const OktaSignInWidget: React.FC<OktaSignInWidgetProps> = ({ onSuccess, onError }) => {
    const widgetRef = useRef<HTMLDivElement | null>(null);  // `widgetRef` refers to a div

    // @ts-ignore
    useEffect(() => {
        if (!widgetRef.current) {
            return false;
        }

        const widget = new OktaSignIn(oktaConfig);

        widget
            .showSignInToGetTokens({
                // @ts-ignore
                el: widgetRef.current,
            })
            .then(onSuccess)
            .catch(onError);

        // Cleanup: Remove widget on unmount
        return () => widget.remove();
    }, [onSuccess, onError]);

    return (
        <div className="container mt-5 mb-5">
            <div ref={widgetRef}></div>
        </div>
    );
};

export default OktaSignInWidget;
