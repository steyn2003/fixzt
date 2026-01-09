import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export function MarketingNavigation() {
    const { url } = usePage();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const links = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Diensten' },
        { href: '/about', label: 'Over Ons' },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full bg-white shadow-sm"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="relative h-16 w-52"
                    >
                        <img
                            src="/logo.png"
                            alt="Fixzt Logo"
                            className="h-full w-full object-contain"
                        />
                    </motion.div>
                </Link>

                <nav className="flex items-center space-x-6">
                    {links.map((link, index) => (
                        <div
                            key={link.href}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Link
                                href={link.href}
                                className={cn(
                                    'relative z-10 text-sm font-medium transition-colors',
                                    isActive(link.href)
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-primary',
                                )}
                            >
                                {link.label}
                            </Link>
                            {(isActive(link.href) || hoveredIndex === index) && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </div>
                    ))}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button size="sm">Contact</Button>
                    </motion.div>
                </nav>
            </div>
        </motion.header>
    );
}
