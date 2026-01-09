'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeIn({
    children,
    delay = 0,
    duration = 0.5,
    className,
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function SlideIn({
    children,
    delay = 0,
    direction = 'left',
    className,
}: FadeInProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
    const directionOffset = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: -50 },
        down: { x: 0, y: 50 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({ children, delay = 0, className }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FloatingElement({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};
