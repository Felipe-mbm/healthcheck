export interface BrandingConfig {
    companyName: string;
    logoUrl: string;
    theme: 'default' | 'red-client' | 'purple-client';
    colors?: {
        primary: string;
        secondary: string;
    };
}

export const currentConfig: BrandingConfig = {
    companyName: "System Monitor",
    logoUrl: "/vite.svg",
    theme: "default",
    colors: {
        primary: "#00D4FF",
        secondary: "#4A90E2"
    }
};