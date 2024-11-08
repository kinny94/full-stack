// @ts-nocheck
import React from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {Home} from "./layouts/Homepage/Home";
import {Search} from "./layouts/Search/Search";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Checkout} from "./layouts/checkout/Checkout";
import {OktaAuth, toRelativeUrl} from "@okta/okta-auth-js";
import {oktaConfig} from "./lib/oktaConfig";
import {LoginCallback, Security} from "@okta/okta-react";
import LoginWidget from "./authentication/LoginWidget";
import { ReviewList } from './layouts/checkout/ReviewList/ReviewList';
import {Shelf} from "./layouts/Shelf/Shelf";
import { SecureRoute } from './custom/SecureRoute';
import {Messages} from "./layouts/messages/Messages";
import {ManageLibrary} from "./layouts/ManageLibrary/ManageLibrary";

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {

    const navigate = useNavigate();
    const customAuthHandler = () => {
        navigate('/login');
    };
    const restoreOriginalUrl = async (_oktaAuth: any, originalUri: any) => {
        navigate(toRelativeUrl(originalUri || '/', window.location.origin), {replace: true});
    }
    // ts ignore for file
    return (
        <div className="d-flex flex-column min-vh-100">
            <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUrl} onAuthRequired={customAuthHandler}>
                <Navbar/>
                <div className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/reviewlist/:bookid" element={<ReviewList/>}/>
                        <Route path="/search" element={<Search/>}/>
                        <Route path="/checkout/:bookId" element={<Checkout/>}/>
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        <Route path="/login" element={<LoginWidget config={oktaConfig}/>} />
                        <Route path="/login/callback" element={<LoginCallback/>} />
                        <Route element={<SecureRoute />}>
                            <Route path="/shelf" element={<Shelf />} /> {/* Only authenticated users can access this */}
                        </Route>
                        <Route element={<SecureRoute />}>
                            <Route path="/messages" element={<Messages />} /> {/* Only authenticated users can access this */}
                        </Route>
                        <Route element={<SecureRoute />}>
                            <Route path="/admin" element={<ManageLibrary />} /> {/* Only authenticated users can access this */}
                        </Route>
                    </Routes>
                </div>
                <Footer/>
            </Security>
        </div>
    );
}