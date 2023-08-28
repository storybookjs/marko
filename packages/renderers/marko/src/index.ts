/// <reference types="marko" />

import "./globals";
export * from "./public-api";
export * from "./public-types";
export * from "./testing-api";

// optimization: stop HMR propagation in webpack
if (typeof module !== "undefined") (module as any)?.hot?.decline();
