/**
 * Main Router.
 */
import Vue from "vue";
import Router from "vue-router";
import {Child} from "./child/child";

Vue.use(Router);

export default new Router({
    "routes": [
        {
            "path": "/",
            "name": "Child",
            "component": Child
        }
    ]
});

// Generated by UniteJS
