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

export const IsPluginType = (type: string): type is PluginType => {
    return Object.values(PluginType).includes(type as PluginType);
};

export interface PluginEntrypoint {
    type: PluginType;
    description: string;
    module: unknown;
}
