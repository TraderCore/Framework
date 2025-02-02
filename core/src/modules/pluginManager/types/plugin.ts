export interface PluginInternal extends Plugin {
    location: string;
}

export interface Plugin {
    name: string;
    version: string;
    entrypoints: PluginEntrypoint[];
}

export enum PluginType {
    Api = 'api',
    Processor = 'processor',
    Ingress = 'ingress',
}

export interface PluginEntrypoint {
    type: PluginType;
    description: string;
    module: unknown;
}
