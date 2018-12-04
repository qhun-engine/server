import { ReflectionMetadata } from "@qhun-engine/base";

/**
 * defined global reflection metadata for the server module
 */
export const ServerReflectionMetadata = {
    ...ReflectionMetadata,

    Controller: "server:controller:prefix",
    RequestMapping: "server:controller:requestMapping"
};
