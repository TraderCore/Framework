import { Inject, Injectable, Logger } from '@nestjs/common';
import { DATABASE } from '@tradercore/framework';
import type { SQL } from 'bun';

export interface TestEntry {
    id: string;
    message: string;
    // biome-ignore lint/style/useNamingConvention: database column name
    created_at: Date;
}

@Injectable()
export class TestService {
    private readonly logger = new Logger(TestService.name);

    constructor(@Inject(DATABASE) private readonly db: SQL) {}

    onModuleInit() {
        this.logger.log('Test plugin initialized');
    }

    ping(): string {
        return 'pong';
    }

    async createEntry(id: string, message: string): Promise<TestEntry> {
        const [entry] = await this.db`
            INSERT INTO test_plugin_entries (id, message, created_at)
            VALUES (${id}, ${message}, NOW())
            RETURNING *
        `;
        return entry as TestEntry;
    }

    async getEntries(): Promise<TestEntry[]> {
        const rows = await this.db`SELECT * FROM test_plugin_entries`;
        return rows as TestEntry[];
    }
}
