export interface PluginInternal extends Plugin {
    location: string;
}

export interface Plugin {
    name: string;
    version: string;
    module: unknown;
}
