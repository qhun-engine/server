import * as http from "http";
import * as express from "express";

export interface BootstrapOptions {

    /**
     * the prefix path for all filesystem related paths
     * @default: "${cwd}/public"
     */
    documentRoot?: string;

    /**
     * the http port number.
     * @default 7500
     */
    httpPort?: number;

    /**
     * the https port number.
     * - if no https port is given, the server will not provide a https connection
     * @default undefined
     */
    httpsPort?: number;

    /**
     * use the given http server instance as the base. the express server will use
     * this instance and configures its routes next to existing routes.
     * @default undefined
     */
    useExistingHttpServer?: http.Server;

    /**
     * use the given existing express router and add new routes to it
     * @default undefined
     */
    useExistingExpressRouter?: express.Router;
}
