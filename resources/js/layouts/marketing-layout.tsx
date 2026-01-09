import { MarketingNavigation } from '@/components/marketing-navigation';
import { ContactModalProvider } from '@/contexts/contact-modal-context';
import { ReactNode } from 'react';

interface MarketingLayoutProps {
    children: ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
    return (
        <ContactModalProvider>
            <div className="min-h-screen bg-background">
                <MarketingNavigation />
                <main>{children}</main>
            </div>
        </ContactModalProvider>
    );
}
