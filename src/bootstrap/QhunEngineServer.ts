import { Injectable, ClassConstructor, Injector } from "@qhun-engine/base";

import { BootstrapOptions } from "./BootstrapOptions";
import { ServerOptions } from "./ServerOptions";

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
