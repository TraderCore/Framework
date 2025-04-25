export type PluginManagerOptions = {
    /**
     * The registries to use to load plugins from. Comma separated list of <url:authorization> pairs.
     */
    registriesString: string;

    /**
     * The plugins to load. Comma separated list of URLs.
     */
    pluginsString: string;

    /**
     * The Allowed Plugin Entrypoints Types. Comma separated list of PluginType values.
     */
    allowedEntrypointTypesString?: string;
};
