import { createClient } from 'redis';

export async function factory() {
    const client = createClient();
    await client.connect();
    return client;
} 