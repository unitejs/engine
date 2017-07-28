/**
 * Bootstrapper for the app.
 */
import {App} from "./app";

/**
 * Function to bootstrap the application
 * @returns {void}
 */
export function bootstrap(): void {
    const app = new App();
    app.run(document.getElementById("root"));
}

/* Generated by UniteJS */