export interface Monitor {
    id: number;
    name: string;
    url: string;
    status: 'online' | 'offline' | 'paused' | 'pending';
    failures: number;
    downtime: string;
}