/**
 * Main entry point for app.
 */
/// <reference types="unitejs-types" />
import {enableProdMode} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app.module";

export function bootstrap(): void {
    const baseElement = document.createElement("base");
    baseElement.href = "./";
    window.document.head.appendChild(baseElement);

    if (window.unite.configName !== "dev") {
        enableProdMode();
    }

    platformBrowserDynamic().bootstrapModule(AppModule);
}

// Generated by UniteJS
