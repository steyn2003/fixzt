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

export default function Welcome() {
    const features = [
        {
            title: 'Full-Service Onderhoud',
            description: 'Eén partij voor alle onderhoudswerkzaamheden',
            icon: '🔧',
            content:
                'Van kleine reparaties tot preventief onderhoud - wij zijn uw vaste, betrouwbare partner voor alle onderhoudsklussen in commercieel vastgoed.',
        },
        {
            title: 'Commercieel Vastgoed Specialist',
            description:
                'Gespecialiseerd in kantoren, winkelcentra en bedrijfsruimtes',
            icon: '🏢',
            content:
                'Wij kennen de specifieke eisen van commercieel vastgoed en zorgen dat uw gebouw technisch in topconditie blijft voor uw huurders.',
        },
        {
            title: 'Snelle Respons',
            description: 'Direct schakelen bij noodgevallen en acute problemen',
            icon: '⚡',
            content:
                'Uw eerste aanspreekpunt op locatie. Wij zorgen voor snelle respons bij storingen en noodgevallen om grotere problemen te voorkomen.',
        },
    ];

    const stats = [
        { value: '24/7', label: 'Bereikbaar' },
        { value: '100+', label: 'Beheerde Locaties' },
        { value: '10+', label: 'Jaar Ervaring' },
        { value: '98%', label: 'Klanttevredenheid' },
    ];

    const targetAudience = [
        {
            title: 'Vastgoedbeheerders',
            description: 'Ontzorging voor alle dagelijkse onderhoudsklussen',
            icon: '👔',
        },
        {
            title: 'Vastgoedeigenaren',
            description: 'Technisch beheer om waarde te behouden',
            icon: '🏛️',
        },
        {
            title: 'Vastgoedbeleggers',
            description: 'Betrouwbaar onderhoud voor uw portfolio',
            icon: '📊',
        },
    ];

    const buildingTypes = [
        {
            title: 'Winkelpanden & Winkelcentra',
            description: 'Onderhoud voor retail vastgoed',
            image: '/building-retail.png',
        },
        {
            title: 'Kantoorgebouwen',
            description: 'Facility management voor kantoren',
            image: '/building-office.png',
        },
        {
            title: 'Light Industrial & Bedrijfsruimtes',
            description: 'Technisch onderhoud bedrijfspanden',
            image: '/building-industrial.png',
        },
        {
            title: 'Zorglocaties',
            description: 'Betrouwbaar onderhoud zorginstellingen',
            image: '/building-care.png',
        },
        {
            title: 'Hotels',
            description: 'Continue inzetbaarheid horecavastgoed',
            image: '/building-hotel.png',
        },
        {
            title: 'Wooncomplexen',
            description: 'Complexmatig beheer woongebouwen',
            image: '/building-residential.png',
        },
    ];

    const services = [
        {
            step: '01',
            title: 'Kleine Reparaties & Dagelijks Onderhoud',
            description:
                'Van lekkende kranen tot kapotte deurknoppen - alle kleine klussen die dagelijks voorkomen in commercieel vastgoed.',
        },
        {
            step: '02',
            title: 'Preventief Onderhoud & Inspecties',
            description:
                'Regelmatige controles en preventief onderhoud om grotere problemen en kostbare storingen te voorkomen.',
        },
        {
            step: '03',
            title: 'Snelle Respons & Noodgevallen',
            description:
                '24/7 bereikbaar voor acute storingen. Wij schakelen snel om downtime te minimaliseren en uw huurders tevreden te houden.',
        },
        {
            step: '04',
            title: 'Eerste Aanspreekpunt op Locatie',
            description:
                'Uw ogen en oren ter plaatse. Wij signaleren problemen tijdig en denken proactief mee in onderhoudsbeheer.',
        },
        {
            step: '05',
            title: 'Kleine Projecten & Vervangingswerk',
            description:
                'Ook voor kleinschalige renovaties en vervangingen kunt u bij ons terecht - zonder de overhead van grote aannemers.',
        },
    ];

    const testimonials = [
        {
            name: 'Peter van der Meer',
            role: 'Vastgoedbeheerder',
            content:
                'Fixzt denkt mee en pakt zaken direct op. Sinds wij met hen werken zijn onze huurders een stuk tevredener over het technisch onderhoud.',
            rating: 5,
        },
        {
            name: 'Linda Bakker',
            role: 'Property Manager Winkelcentrum',
            content:
                'Eindelijk één partij voor alle kleine klussen. Fixzt is betrouwbaar, reageert snel en werkt netjes. Precies wat je nodig hebt in een druk winkelcentrum.',
            rating: 5,
        },
        {
            name: 'Mark Jansen',
            role: 'Vastgoedbelegger',
            content:
                'Voor mijn kantoorpanden is Fixzt onmisbaar. Ze houden alles in topconditie en voorkomen dat kleine problemen grote reparaties worden.',
            rating: 5,
        },
    ];

    const whyFixzt = [
        {
            title: 'Full-Service',
            description: 'Eén partij voor alle onderhoudswerkzaamheden',
            icon: '✓',
            content:
                'Geen gedoe met verschillende leveranciers. Wij regelen alles - van elektra tot sanitair, van schilderwerk tot kleine verbouwingen.',
        },
        {
            title: 'Commercieel Vastgoed als Specialisatie',
            description: 'Wij begrijpen uw vastgoed',
            icon: '✓',
            content:
                'Jarenlange ervaring met kantoren, winkelcentra en bedrijfspanden. Wij kennen de eisen en werken discreet tijdens openingstijden.',
        },
        {
            title: 'Snelle Respons',
            description: 'Direct schakelen wanneer nodig',
            icon: '✓',
            content:
                'Storing? Lekkage? Wij zijn er snel. Minimale downtime betekent tevreden huurders en behoud van waarde.',
        },
        {
            title: 'Preventief én Correctief',
            description: 'Problemen voorkomen én oplossen',
            icon: '✓',
            content:
                'Regelmatige inspecties en preventief onderhoud voorkomen grotere problemen. En als er toch iets misgaat, lossen wij het snel op.',
        },
        {
            title: 'Ogen en Oren op Locatie',
            description: 'Proactief meedenken',
            icon: '✓',
            content:
                'Tijdens onderhoudswerkzaamheden signaleren wij mogelijke toekomstige problemen en adviseren wij proactief over verbeteringen.',
        },
    ];

    return (
        <MarketingLayout>
            <Head title="Fixzt - Uw Gebouw Technisch in Topconditie" />
            <div className="flex flex-col">
                {/* Hero Section with Animation */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary to-background py-10 md:py-12 lg:py-20 xl:py-24">
                    <div className="relative z-10 container mx-auto">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-8">
                                <FadeIn>
                                    <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                        Full-Service Onderhoud Commercieel
                                        Vastgoed
                                    </div>
                                </FadeIn>

                                <SlideIn direction="right">
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                        Uw Gebouw Technisch in Topconditie
                                    </h1>
                                </SlideIn>

                                <SlideIn direction="right" delay={0.2}>
                                    <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                                        Fixzt ondersteunt vastgoedbeheerders,
                                        eigenaren en beleggers bij alle kleine
                                        reparaties, dagelijks onderhoud en
                                        terugkerende klussen in kantoorgebouwen,
                                        winkelcentra en andere commerciële
                                        panden. Eén vaste, betrouwbare partij.
                                    </p>
                                </SlideIn>

                                <SlideIn direction="right" delay={0.4}>
                                    <div className="flex flex-col gap-4 sm:flex-row">
                                        <Link href="/services">
                                            <Button
                                                size="lg"
                                                className="w-full sm:w-auto"
                                            >
                                                Onze Diensten
                                            </Button>
                                        </Link>
                                        <Link href="/about">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="w-full sm:w-auto"
                                            >
                                                Over Fixzt
                                            </Button>
                                        </Link>
                                    </div>
                                </SlideIn>

                                <SlideIn direction="right" delay={0.6}>
                                    <div className="flex gap-8 pt-4">
                                        {stats
                                            .slice(0, 3)
                                            .map((stat, index) => (
                                                <div key={index}>
                                                    <div className="text-2xl font-bold text-primary md:text-3xl">
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </SlideIn>
                            </div>

                            <ScaleIn delay={0.3}>
                                <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl md:h-[500px] lg:h-[600px]">
                                    <img
                                        src="/homepage.jpg"
                                        alt="Fixzt onderhoud commercieel vastgoed"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </ScaleIn>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="w-full bg-primary py-12 text-primary-foreground">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {stats.map((stat, index) => (
                                <FadeIn key={index} delay={index * 0.1}>
                                    <div className="text-center">
                                        <motion.div
                                            className="mb-2 text-4xl font-bold md:text-5xl"
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            {stat.value}
                                        </motion.div>
                                        <div className="text-sm opacity-90 md:text-base">
                                            {stat.label}
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Target Audience Section */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Voor Wie is Fixzt?
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Wij ondersteunen professionele partijen in
                                    de commerciële vastgoedmarkt
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {targetAudience.map((audience, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="h-full border-2 transition-colors hover:border-primary/50">
                                            <CardHeader>
                                                <div className="mb-4 text-4xl">
                                                    {audience.icon}
                                                </div>
                                                <CardTitle>
                                                    {audience.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {audience.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Building Types */}
                <section className="w-full bg-secondary py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Type Gebouwen
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Wij verzorgen onderhoud voor diverse
                                    commerciële vastgoedtypen
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {buildingTypes.map((building, index) => (
                                <SlideIn
                                    key={index}
                                    direction={
                                        index % 2 === 0 ? 'left' : 'right'
                                    }
                                    delay={index * 0.1}
                                >
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="h-full overflow-hidden transition-shadow hover:shadow-xl">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={building.image}
                                                    alt={building.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </div>
                                            <CardHeader>
                                                <CardTitle>
                                                    {building.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {building.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </SlideIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Services Section - What We Do */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Wat Doen We Precies?
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Onze diensten voor optimaal onderhoud van uw
                                    commercieel vastgoed
                                </p>
                            </div>
                        </FadeIn>

                        <div className="relative">
                            {/* Connection Line */}
                            <div className="absolute top-1/2 right-0 left-0 hidden h-0.5 -translate-y-1/2 bg-border lg:block" />

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                                {services.map((item, index) => (
                                    <FadeIn key={index} delay={index * 0.1}>
                                        <motion.div
                                            className="relative"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card className="relative z-10 h-full bg-background">
                                                <CardHeader>
                                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                                                        {item.step}
                                                    </div>
                                                    <CardTitle className="text-xl">
                                                        {item.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Fixzt Section */}
                <section className="w-full bg-secondary py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Waarom Kiezen voor Fixzt?
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Uw betrouwbare partner in commercieel
                                    vastgoedonderhoud
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {whyFixzt.map((feature, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="h-full border-2 transition-colors hover:border-primary/50">
                                            <CardHeader>
                                                <div className="mb-4 text-4xl font-bold text-primary">
                                                    {feature.icon}
                                                </div>
                                                <CardTitle>
                                                    {feature.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    {feature.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    {feature.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    Wat Onze Klanten Zeggen
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    Vastgoedprofessionals over hun ervaringen
                                    met Fixzt
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {testimonials.map((testimonial, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Card className="h-full">
                                            <CardHeader>
                                                <div className="mb-2 flex gap-1">
                                                    {[
                                                        ...Array(
                                                            testimonial.rating,
                                                        ),
                                                    ].map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-yellow-500"
                                                        >
                                                            ⭐
                                                        </span>
                                                    ))}
                                                </div>
                                                <CardTitle className="text-lg">
                                                    {testimonial.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {testimonial.role}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground italic">
                                                    "{testimonial.content}"
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="w-full bg-secondary py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <Card className="border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                <CardContent className="p-8 md:p-12">
                                    <div className="grid items-center gap-8 lg:grid-cols-2">
                                        <div>
                                            <h3 className="mb-4 text-3xl font-bold">
                                                Blijf Op De Hoogte
                                            </h3>
                                            <p className="mb-6 text-primary-foreground/90">
                                                Ontvang praktische tips voor
                                                vastgoedonderhoud,
                                                onderhoudsplanningen en updates
                                                over onze diensten.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-4 sm:flex-row">
                                            <input
                                                type="email"
                                                placeholder="Voer uw e-mailadres in"
                                                className="flex-1 rounded-md px-4 py-3 text-foreground"
                                            />
                                            <Button
                                                size="lg"
                                                variant="secondary"
                                            >
                                                Abonneer
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </FadeIn>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="w-full bg-gradient-to-br from-secondary via-background to-secondary py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="flex flex-col items-center space-y-8 text-center">
                                <div className="max-w-[800px] space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                                        Klaar Om Uw Vastgoed Te Ontzorgen?
                                    </h2>
                                    <p className="text-muted-foreground md:text-xl">
                                        Neem vandaag nog contact met ons op en
                                        ontdek hoe Fixzt uw gebouwen in
                                        topconditie houdt, uw huurders tevreden
                                        stelt en grotere problemen voorkomt.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <ContactButton
                                        size="lg"
                                        className="px-8 text-lg"
                                    >
                                        Neem Contact Op
                                    </ContactButton>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link href="/services">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className="px-8 text-lg"
                                            >
                                                Bekijk Diensten
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
