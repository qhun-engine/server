import { ClassConstructor, Injectable, MetadataRegistryService } from "@qhun-engine/base";
import { ServerReflectionMetadata } from "../constraint/ServerReflectionMetadata";
import "reflect-metadata";

export declare type ControllerMetadataStructure = {
    prefix: string,
    name: string
};

/**
 * A class level decorator to tell the router that this class is a controller that can handle
 * api requests with some of its functions. A `@Controller` class will be `@Injectable` and  `@Singleton`
 * @param prefixPath the prefix path for all `@RequestMapping` methods
 */
export function Controller(prefixPath: string): ClassDecorator {

    return <ClassDecorator>((target: ClassConstructor) => {

        // register prefix for controller via reflection
        MetadataRegistryService.getInstance().setValue(ServerReflectionMetadata.Controller, target, {
            name: target.name,
            prefix: prefixPath
        } as ControllerMetadataStructure);

        // return class impl that extends the injectable class
        return class ControllerImpl extends (Injectable()(target) as ClassConstructor) { };
    });
}
