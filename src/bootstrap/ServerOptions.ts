import { Injectable } from "@qhun-engine/base";
import { BootstrapOptions } from "./BootstrapOptions";
import * as http from "http";

@Injectable({ skipOwnDependencies: true })
export class ServerOptions {

    /**
     * the existing server options
     */
    private bootstrapOptions: BootstrapOptions;

    /**
     * @param bootstrapOptions the available bootstrap options. this class handles default values if no value was given
     */
    constructor(
        bootstrapOptions: Partial<BootstrapOptions>
    ) {

        // handle default
        this.bootstrapOptions = this.handleDefaults(bootstrapOptions);
    }

    /**
     * get the document root of the server
     */
    public getDocumentRoot(): BootstrapOptions["documentRoot"] {

        return this.bootstrapOptions.documentRoot;
    }

    /**
     * get the configured http port
     */
    public getHttpPort(): BootstrapOptions["httpPort"] {

        return this.bootstrapOptions.httpPort;
    }

    /**
     * get the existing express app instance if any
     */
    public getExistingExpressApp(): BootstrapOptions["useExistingExpressApp"] {

        return this.bootstrapOptions.useExistingExpressApp;
    }

    /**
     * get the existing http server instance if any
     */
    public getExistingHttpServer(): BootstrapOptions["useExistingHttpServer"] {

        return this.bootstrapOptions.useExistingHttpServer;
    }

    /**
     * set nessesary server options when no value is given
     * @param bootstrapOptions the partial options
     */
    private handleDefaults(bootstrapOptions: Partial<BootstrapOptions>): BootstrapOptions {

        return {
            documentRoot: bootstrapOptions.documentRoot || `${process.cwd()}/public`,
            httpPort: typeof bootstrapOptions.httpPort === "number" ? bootstrapOptions.httpPort : 7500,
            httpsPort: typeof bootstrapOptions.httpsPort === "number" ? bootstrapOptions.httpsPort : undefined,
            useExistingHttpServer: bootstrapOptions.useExistingHttpServer instanceof http.Server ? bootstrapOptions.useExistingHttpServer : undefined
        };
    }
}
