/**
 * Main entry point for app.
 */
import { App } from "./app";

export function entryPoint(): void {
    const app = new App();
    app.run();
}