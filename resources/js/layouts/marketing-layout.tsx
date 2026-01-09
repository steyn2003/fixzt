import { MarketingNavigation } from '@/components/marketing-navigation';
import { ReactNode } from 'react';

interface MarketingLayoutProps {
    children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <MarketingNavigation />
            <main>{children}</main>
        </div>
    );
}
