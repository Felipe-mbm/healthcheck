import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AdminOnlyProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export function AdminOnly({ children, fallback }: AdminOnlyProps) {
    const { user } = useAuth();

    if (!user || user.role !== 'ADMIN') {
        return fallback ? <>{fallback}</> : null;
    }

    return <>{children}</>;
}