export interface BrandingConfig {
    companyName: string;
    logoUrl: string;
    theme: 'default' | 'red-client' | 'purple-client';
}

// Em um cenário real, isso poderia vir de uma API (GET /api/config)
export const currentConfig: BrandingConfig = {
    companyName: "System Monitor",
    // Pode colocar uma URL da web ou um import local
    logoUrl: "/vite.svg",
    theme: "default"
};