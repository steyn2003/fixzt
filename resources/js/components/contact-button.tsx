import { Button, ButtonProps } from '@/components/ui/button';
import { useContactModal } from '@/contexts/contact-modal-context';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContactButtonProps extends Omit<ButtonProps, 'onClick'> {
    children: ReactNode;
    animated?: boolean;
}

export function ContactButton({ children, animated = true, ...props }: ContactButtonProps) {
    const { openContactModal } = useContactModal();

    if (animated) {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button onClick={openContactModal} {...props}>
                    {children}
                </Button>
            </motion.div>
        );
    }

    return (
        <Button onClick={openContactModal} {...props}>
            {children}
        </Button>
    );
}
