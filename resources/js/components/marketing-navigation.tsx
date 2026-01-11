import { Button } from '@/components/ui/button';
import { useContactModal } from '@/contexts/contact-modal-context';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MarketingNavigation() {
    const { url } = usePage();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openContactModal } = useContactModal();

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMenuOpen(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

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
        <>
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
                            className="relative h-12 w-40 md:h-16 md:w-52"
                        >
                            <img
                                src="/logo.png"
                                alt="Fixzt Logo"
                                className="h-full w-full object-contain"
                            />
                        </motion.div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-6 md:flex">
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
                                {(isActive(link.href) ||
                                    hoveredIndex === index) && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute right-0 -bottom-[21px] left-0 h-0.5 bg-primary"
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
                            <Button size="sm" onClick={openContactModal}>
                                Contact
                            </Button>
                        </motion.div>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
                        onClick={() => setIsMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMenuOpen}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 bg-black/50 md:hidden"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 z-50 h-full w-3/4 max-w-sm bg-white shadow-xl md:hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex h-16 items-center justify-end px-4">
                                <button
                                    className="flex h-10 w-10 items-center justify-center rounded-md text-foreground"
                                    onClick={() => setIsMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Drawer Content */}
                            <nav className="flex flex-col px-6">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            'border-b border-gray-100 py-4 text-lg font-medium transition-colors',
                                            isActive(link.href)
                                                ? 'text-primary'
                                                : 'text-muted-foreground hover:text-primary',
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Button
                                    className="mt-6 w-full"
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        openContactModal();
                                    }}
                                >
                                    Contact
                                </Button>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
