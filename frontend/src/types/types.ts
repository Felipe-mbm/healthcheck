export interface Monitor {
    id: string;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'paused' | 'pending';
    failures: number;
    downtime: string;
}