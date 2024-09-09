import {Explore} from "./components/Explore";
import {Carousel} from "./components/Carousel";
import {Heros} from "./components/Heros";
import {Library} from "./components/Library";
import React from "react";

export const Home = () => {
    return (
        <>
            <Explore/>
            <Carousel />
            <Heros />
            <Library />
        </>
    )
}