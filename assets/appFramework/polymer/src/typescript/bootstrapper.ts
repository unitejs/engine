/**
 * Bootstrapper for the app.
 */
import "./app";

/**
 * Function to bootstrap the application
 * @returns {void}
 */
export function bootstrap (): void {
    const appElement = document.createElement("unite-app");
    document.getElementById("root").appendChild(appElement);
}

// Generated by UniteJS
