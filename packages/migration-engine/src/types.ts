export interface PluginMigration {
    version: string;
    sql: string;
}

export interface PluginMigrationSet {
    pluginName: string;
    migrations: PluginMigration[];
}
