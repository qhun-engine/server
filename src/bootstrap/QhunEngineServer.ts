import { Injectable, ClassConstructor, Injector } from "@qhun-engine/base";

import { BootstrapOptions } from "./BootstrapOptions";
import { ServerOptions } from "./ServerOptions";
import { Router } from "../router/Router";
import * as http from "http";
import * as express from "express";

/**
 * a class level decorator to bootstrap your server module of the qhun-engine
 * @param options all options of the server module
 */
export function QhunEngineServer(options: BootstrapOptions = {}): ClassDecorator {

    return <ClassDecorator>(<T extends ClassConstructor>(target: T) => {

        // construct the server options object and store it in the di system
        const serverOptions = new ServerOptions(options);

        Injector.getInstance().addToCache(ServerOptions, serverOptions);

        // return the bootstrap impl
        // tslint:disable-next-line
        new (class QhunEngineServerImpl extends (Injectable()(target) as ClassConstructor) { });

        // get the router and start everything
        const expressRouter = Injector.getInstance().instantiateClass(Router).setupRouter();

        // construct the express app
        let expressApp: express.Application = serverOptions.getExistingExpressApp() as express.Application;
        if (!expressApp) {
            expressApp = express();
        }

        // use the configures router
        expressApp.use(expressRouter);

        // create the http server or reuse the given server
        let server: http.Server = serverOptions.getExistingHttpServer() as http.Server;
        if (!server) {
            server = http.createServer(expressApp);
        }

        // use the injector to cache the server instance for reusage
        Injector.getInstance().addToCache(http.Server, server);

        // start listening!
        server.listen(options.httpPort);
    });
}

/*
export class QhunEngineServer {

    @Inject()
    private router!: Router;
    private expressApp: express.Application;

    constructor() {

        // build express app
        this.expressApp = express();
        this.expressApp.use(this.router.getConfiguredExpressRouter());
    }

    public listen(port: number = 3000): http.Server {

        return http.createServer(this.expressApp).listen(port);
    }
}
*/
