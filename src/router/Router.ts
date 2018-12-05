import { Injectable, Injector, MetadataRegistryService, ClassConstructor } from "@qhun-engine/base";

import { Router as ExpressRouter } from "express";
import { ControllerMetadataStructure } from "../controller/Controller";
import { RequestMappingStructure, HttpMethod } from "./RequestMapping";
import { FileResponse } from "../controller/response/FileResponse";
import { ServerReflectionMetadata } from "../constraint/ServerReflectionMetadata";
import { RouterError } from "../error/RouterError";
import { ServerOptions } from "../bootstrap/ServerOptions";
import * as express from "express";
import * as path from "path";

@Injectable()
export class Router {

    /**
     * the express router instance
     */
    private expressRouter: ExpressRouter;

    /**
     * contains the controller stack
     */
    private controllerStack: ClassConstructor[] = [];

    constructor(
        private options: ServerOptions
    ) {

        // build a new router
        this.expressRouter = ExpressRouter({
            caseSensitive: false
        });
    }

    /**
     * add the given controller to the router bootstrap process
     * @param controller the controller to add
     */
    public addController(controller: ClassConstructor): this {

        this.controllerStack.push(controller);
        return this;
    }

    /**
     * bind all existing roues from every `@Controller` context to the express router
     */
    public setupRouter(): ExpressRouter {

        // get the injector for controller instantiation
        const injector = Injector.getInstance();

        this.controllerStack.forEach(controller => {

            // get prefix for controller
            const metadataService = MetadataRegistryService.getInstance();
            const controllerMetadata: ControllerMetadataStructure = metadataService.get(ServerReflectionMetadata.Controller, controller);

            // check if there is any metadata
            if (typeof controllerMetadata !== "object") {
                throw new RouterError(`${controller.name} should have the @Controller decorator but no metadata found`);
            }

            // get controller instance
            const controllerInstance = injector.instantiateClass(controller as any);

            // get request mapping metadata
            const requestMappingMetadata: RequestMappingStructure = metadataService.get(ServerReflectionMetadata.RequestMapping, controllerInstance);

            // iterate over every request mapping and add it to the router
            Object.keys(requestMappingMetadata).forEach((requestPath: keyof RequestMappingStructure) => {

                const settings = requestMappingMetadata[requestPath];
                this.addRequestMapping(
                    controllerMetadata.prefix,
                    requestPath as string,
                    settings.method,
                    settings.handler,
                    `${controllerMetadata.name}@${settings.methodName}`
                );
            });

        });

        return this.expressRouter;
    }

    /**
     * add the given request mapping to the router
     * @param prefix the controller prefix
     * @param path the request mapping path
     * @param method the http method to listen on
     * @param handler the handler function
     * @param name a visible name for debug purpose for this endpoint
     */
    private addRequestMapping(prefix: string, requestPath: string, method: HttpMethod, handler: ((...args: any[]) => any), name: string): void {

        // add this request mapping
        this.expressRouter[method](prefix + requestPath, (request, response) => {
            this.handleRouterResponse(request, response, handler);
        });

        // log this info
        console.log(`[${method.toUpperCase()}] ${prefix + requestPath} => ${name}`);
    }

    /**
     * handle the router response
     * @param request the express request
     * @param response the express response
     * @param handler the handler function
     */
    private handleRouterResponse(request: express.Request, response: express.Response, handler: ((...args: any[]) => any)): void {

        this.respondWithHandlerResult(handler(request), response);
    }

    /**
     * handles the result with different response instances
     * @param result the result of the controller
     * @param response the express response object
     */
    private respondWithHandlerResult(result: any, response: express.Response): void {

        // what does handler returned?
        if (result && result instanceof FileResponse) {

            // get the file path and prefix it
            // with the document root path
            const filePath = result.getPath();

            // express need a normalized absolute path. build it
            const expressPath = path.resolve(path.normalize(path.join(this.options.getDocumentRoot()!, filePath)));

            // send the file
            response.sendFile(expressPath);
        } else if (result && result instanceof Promise) {

            result
                .then(res => this.respondWithHandlerResult(res, response))
                .catch(err => this.respondWithHandlerResult(err, response));
        } else {

            response.send(result);
        }
    }

}
