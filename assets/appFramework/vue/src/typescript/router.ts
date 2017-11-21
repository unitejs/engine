/**
 * Main Router class.
 *
 * @export
 * @class Router
 */
import /* Synthetic Import */ Vue from "vue";
import /* Synthetic Import */ Router from "vue-router";
import { Child } from "./child/child";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "Child",
            component: Child
        }
    ]
});

// Generated by UniteJS
