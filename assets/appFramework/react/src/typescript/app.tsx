/**
 * Main application class.
 */
import {SYNTHETIC_IMPORT}React from "react";
import {SYNTHETIC_IMPORT}ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Child } from "./child/child";

export class App {
  public run(rootElement: Element): void {
    ReactDOM.render(<BrowserRouter>
      <Route path="/" component={Child} />
    </BrowserRouter>,
                    rootElement
    );
  }
}

// Generated by UniteJS
