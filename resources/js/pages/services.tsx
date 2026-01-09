import { FadeIn, ScaleIn, SlideIn } from '@/components/animations';
import { ContactButton } from '@/components/contact-button';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MarketingLayout } from '@/layouts/marketing-layout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Services() {
    const services = [
        {
            title: 'Kleine Reparaties & Dagelijks Onderhoud',
            description:
                'Snelle en betrouwbare oplossingen voor dagelijkse onderhoudsvraagstukken',
            icon: '🔧',
            image: '/service-repairs.jpg',
            features: [
                'Oplossen van lekkages',
                'Herstellen van hang- en sluitwerk (deuren, ramen, sloten, scharnieren)',
                'Herstellen van plafonds, wanden en deuren',
                'Klein bouwkundig herstel en afwerking',
            ],
        },
        {
            title: 'Preventief Onderhoud, Controles en Inspecties',
            description:
                'Proactieve bewaking en onderhoud om problemen voor te zijn',
            icon: '🔍',
            image: '/service-inspections.jpg',
            features: [
                'Periodieke controles aan klimaatinstallaties en technische ruimten',
                'Visuele inspecties van bouwkundige en installatietechnische onderdelen',
                "Signaleren van slijtage, risico's en toekomstige onderhoudsbehoefte",
                'Rapportage en terugkoppeling richting beheerder of eigenaar',
            ],
        },
        {
            title: 'Snelle Respons & Noodgevallen',
            description: 'Direct ter plaatse bij storingen en calamiteiten',
            icon: '🚨',
            image: '/service-emergency.jpg',
            features: [
                'Snel ter plaatse bij storingen of calamiteiten',
                'Tijdelijke noodoplossing of directe reparatie waar mogelijk',
                'Communicatie met huurders en betrokken partijen op locatie',
                '24/7 bereikbaarheid voor spoedgevallen',
            ],
        },
        {
            title: 'Eerste Aanspreekpunt op Locatie',
            description:
                'Uw vaste contactpersoon voor alle facilitymanagement vraagstukken',
            icon: '👥',
            image: '/service-coordination.jpg',
            features: [
                'Begeleiding van installateurs en aannemers',
                'Direct contact met huurders en gebruikers',
                'Afstemming met beheerder of assetmanager',
                'Coördinatie van kleine werkzaamheden',
            ],
        },
        {
            title: 'Kleine Projecten & Vervangingswerk',
            description: 'Uitvoering van kleinschalige projecten en upgrades',
            icon: '🏗️',
            image: '/service-projects.jpg',
            features: [
                'Brandmeldinstallaties (vervanging, aanpassingen)',
                'Vervangen van verlichting door LED-oplossingen',
                'Kleinschalige bouwkundige aanpassingen',
                'Deelprojecten in kantoren en light industrial panden',
            ],
        },
    ];

    return (
        <MarketingLayout>
            <Head title="Onze Diensten - Fixzt" />
            <div className="flex flex-col">
                {/* Header Section with Animation */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary to-background py-16 md:py-24 lg:py-32">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-20">
                        <motion.div
                            className="absolute top-10 right-10 h-64 w-64 rounded-full bg-primary blur-3xl"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-6 text-center">
                            <FadeIn>
                                <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                    Wat Wij Bieden
                                </div>
                            </FadeIn>

                            <SlideIn direction="down">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    Onze{' '}
                                    <span className="text-primary">
                                        Diensten
                                    </span>
                                </h1>
                            </SlideIn>

                            <FadeIn delay={0.2}>
                                <p className="mx-auto max-w-[800px] text-lg text-muted-foreground md:text-xl">
                                    Professioneel gebouwbeheer en technisch
                                    onderhoud voor kantoren en light industrial
                                    panden. Van preventief onderhoud tot snelle
                                    reparaties, wij zorgen dat uw vastgoed
                                    optimaal functioneert.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* Services Grid with Animations */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {services.map((service, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full"
                                    >
                                        <Card className="flex h-full flex-col overflow-hidden border-2 transition-colors hover:border-primary/50 hover:shadow-xl">
                                            {/* Image Placeholder */}
                                            <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                                                <motion.div
                                                    className="text-6xl"
                                                    whileHover={{
                                                        scale: 1.2,
                                                        rotate: 5,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    {service.icon}
                                                </motion.div>
                                                <div className="absolute right-2 bottom-2 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                                                    {service.image}
                                                </div>
                                            </div>

                                            <CardHeader>
                                                <CardTitle className="text-xl">
                                                    {service.title}
                                                </CardTitle>
                                                <CardDescription className="text-base">
                                                    {service.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="flex-1">
                                                <ul className="space-y-3">
                                                    {service.features.map(
                                                        (feature, idx) => (
                                                            <motion.li
                                                                key={idx}
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -10,
                                                                }}
                                                                whileInView={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                viewport={{
                                                                    once: true,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        idx *
                                                                        0.1,
                                                                }}
                                                                className="flex items-start"
                                                            >
                                                                <span className="mr-3 text-lg font-bold text-primary">
                                                                    ✓
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {feature}
                                                                </span>
                                                            </motion.li>
                                                        ),
                                                    )}
                                                </ul>

                                                <motion.div
                                                    className="mt-6"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <Button
                                                        className="w-full"
                                                        variant="outline"
                                                    >
                                                        Meer Informatie
                                                    </Button>
                                                </motion.div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="w-full bg-secondary py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Waarom Met Ons Werken?
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Ervaar het verschil van professioneel
                                    gebouwbeheer met een persoonlijke aanpak
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: '🏢',
                                    title: 'Vaste Aanwezigheid in Gebouw',
                                    desc: 'Direct beschikbaar en ter plaatse voor al uw vragen',
                                },
                                {
                                    icon: '⚡',
                                    title: 'Snelle Reactietijd',
                                    desc: 'Snel ingrijpen bij storingen en calamiteiten',
                                },
                                {
                                    icon: '🔍',
                                    title: 'Preventieve Aanpak',
                                    desc: 'Problemen voorkomen door regelmatige controles',
                                },
                                {
                                    icon: '👤',
                                    title: 'Eén Vast Aanspreekpunt',
                                    desc: 'Eén contactpersoon voor alle facilitymanagement vraagstukken',
                                },
                            ].map((benefit, index) => (
                                <SlideIn
                                    key={index}
                                    direction={
                                        index % 2 === 0 ? 'left' : 'right'
                                    }
                                    delay={index * 0.1}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="h-full text-center">
                                            <CardHeader>
                                                <motion.div
                                                    className="mb-4 text-5xl"
                                                    whileHover={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    {benefit.icon}
                                                </motion.div>
                                                <CardTitle className="text-lg">
                                                    {benefit.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {benefit.desc}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </SlideIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Timeline */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Ons Proces
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Een gestroomlijnde aanpak voor optimaal
                                    gebouwbeheer
                                </p>
                            </div>
                        </FadeIn>

                        <div className="mx-auto max-w-4xl">
                            {[
                                {
                                    step: '1',
                                    title: 'Kennismaking & Intake',
                                    desc: 'We maken kennis met uw gebouw en bespreken uw specifieke wensen en behoeften',
                                },
                                {
                                    step: '2',
                                    title: 'Plan van Aanpak',
                                    desc: 'Ontwikkelen van een onderhoudsplan op maat voor uw pand',
                                },
                                {
                                    step: '3',
                                    title: 'Uitvoering & Monitoring',
                                    desc: 'Actieve uitvoering van onderhoud met continue bewaking en rapportage',
                                },
                                {
                                    step: '4',
                                    title: 'Continue Optimalisatie',
                                    desc: 'Regelmatige evaluatie en bijsturing voor optimale prestaties',
                                },
                            ].map((item, index) => (
                                <SlideIn
                                    key={index}
                                    direction={
                                        index % 2 === 0 ? 'left' : 'right'
                                    }
                                    delay={index * 0.1}
                                >
                                    <motion.div
                                        className="mb-12 flex gap-6 last:mb-0"
                                        whileHover={{ x: 10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex-shrink-0">
                                            <motion.div
                                                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground"
                                                whileHover={{
                                                    scale: 1.2,
                                                    rotate: 360,
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {item.step}
                                            </motion.div>
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h3 className="mb-2 text-xl font-bold">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                </SlideIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section with Animation */}
                <section className="w-full bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="flex flex-col items-center space-y-6 text-center">
                                <div className="max-w-[700px] space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        Klaar om te Beginnen?
                                    </h2>
                                    <p className="text-lg text-primary-foreground/90 md:text-xl">
                                        Neem vandaag nog contact met ons op om
                                        te bespreken hoe wij u kunnen helpen met
                                        professioneel gebouwbeheer
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <ContactButton
                                        size="lg"
                                        variant="secondary"
                                        className="px-8 text-lg"
                                    >
                                        Aan de Slag
                                    </ContactButton>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link href="/about">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="border-primary-foreground bg-transparent px-8 text-lg text-primary-foreground hover:bg-primary-foreground/10"
                                            >
                                                Leer Ons Kennen
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </div>
        </MarketingLayout>
    );
}
