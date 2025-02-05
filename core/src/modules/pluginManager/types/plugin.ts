export interface PluginInternal extends Plugin {
    enabled: boolean;
    location: string;
}

export interface Plugin {
    name: string;
    version: string;
    module: unknown;
}
