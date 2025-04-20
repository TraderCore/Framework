import { Environment } from './environment.enum.js';
import { LogLevel } from './log-level.enum.js';

export const EnvironmentToLogLevelMap: Record<Environment, LogLevel> = {
    [Environment.Development]: LogLevel.Debug,
    [Environment.Production]: LogLevel.Info,
};
