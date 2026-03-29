import {
    FadeIn,
    FloatingElement,
    ScaleIn,
    SlideIn,
} from '@/components/animations';
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

interface Props {
    content: Record<string, Record<string, string>>;
}

function c(content: Props['content'], section: string, key: string, fallback: string): string {
    return content?.[section]?.[key] || fallback;
}

export default function About({ content = {} }: Props) {
    const values = [
        {
            title: c(content, 'values', 'value_1_title', 'Betrouwbaar'),
            icon: '🤝',
            description: c(content, 'values', 'value_1_description', 'Wij zijn de vaste partner waarop u kunt rekenen. Consistente kwaliteit en betrouwbare service bij elk onderhoud.'),
        },
        {
            title: c(content, 'values', 'value_2_title', 'Snel & Flexibel'),
            icon: '⚡',
            description: c(content, 'values', 'value_2_description', 'Direct beschikbaar wanneer u ons nodig heeft. Snelle respons en flexibele planning voor al uw onderhoudswensen.'),
        },
        {
            title: c(content, 'values', 'value_3_title', 'Preventief Denken'),
            icon: '🔍',
            description: c(content, 'values', 'value_3_description', 'Wij signaleren problemen voordat ze groot worden. Preventief onderhoud voorkomt dure reparaties en verstoringen.'),
        },
        {
            title: c(content, 'values', 'value_4_title', 'Altijd Bereikbaar'),
            icon: '📞',
            description: c(content, 'values', 'value_4_description', '24/7 beschikbaar voor spoedgevallen. Uw eerste aanspreekpunt op locatie voor alle technische zaken.'),
        },
    ];

    const services = [
        {
            role: c(content, 'why_fixzt', 'item_1_title', 'Dagelijks Onderhoud'),
            icon: '🔧',
            description: c(content, 'why_fixzt', 'item_1_description', 'Klein reparatiewerk en dagelijks technisch onderhoud van uw gebouwen'),
            image: '/team-experts.jpg',
        },
        {
            role: c(content, 'why_fixzt', 'item_2_title', 'Preventief Onderhoud'),
            icon: '🛡️',
            description: c(content, 'why_fixzt', 'item_2_description', 'Regelmatige inspecties en preventieve maatregelen om problemen voor te zijn'),
            image: '/team-legal.jpg',
        },
        {
            role: c(content, 'why_fixzt', 'item_3_title', 'Spoedservice'),
            icon: '🚨',
            description: c(content, 'why_fixzt', 'item_3_description', '24/7 beschikbaar voor spoedgevallen en technische calamiteiten'),
            image: '/team-managers.jpg',
        },
        {
            role: c(content, 'why_fixzt', 'item_4_title', 'Kleine Projecten'),
            icon: '🏗️',
            description: c(content, 'why_fixzt', 'item_4_description', 'Vervangingswerk en kleine projecten binnen uw vastgoed'),
            image: '/team-financial.jpg',
        },
    ];

    const achievements = [
        { number: c(content, 'stats', 'stat_1_value', '500+'), label: c(content, 'stats', 'stat_1_label', 'Panden Beheerd'), icon: '🏢' },
        { number: c(content, 'stats', 'stat_2_value', '1000+'), label: c(content, 'stats', 'stat_2_label', 'Tevreden Huurders'), icon: '😊' },
        { number: c(content, 'stats', 'stat_3_value', '15+'), label: c(content, 'stats', 'stat_3_label', 'Jaar Ervaring'), icon: '📅' },
        { number: c(content, 'stats', 'stat_4_value', '24/7'), label: c(content, 'stats', 'stat_4_label', 'Beschikbaarheid'), icon: '⏰' },
    ];

    const timeline = [
        {
            year: '2008',
            title: 'Opgericht',
            desc: 'Fixzt werd opgericht als specialist in commercieel vastgoed onderhoud',
        },
        {
            year: '2012',
            title: 'Uitbreiding',
            desc: 'Groei naar meerdere locaties met vaste aanwezigheid in gebouwen',
        },
        {
            year: '2018',
            title: 'Digitale Innovatie',
            desc: 'Implementatie van geavanceerd onderhoudsmanagement systeem',
        },
        {
            year: '2023',
            title: 'Marktleider',
            desc: 'Erkend als toonaangevende facility management partner',
        },
    ];

    return (
        <MarketingLayout>
            <Head title="Over Ons - Fixzt" />
            <div className="flex flex-col">
                {/* Hero Section */}
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-secondary to-background py-16 md:py-24 lg:py-32">
                    {/* Animated Background */}
                    <div className="absolute inset-0 hidden opacity-20 md:block">
                        <motion.div
                            className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                        <motion.div
                            className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-accent blur-3xl"
                            animate={{
                                scale: [1.2, 1, 1.2],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>

                    <div className="relative z-10 container mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-6 text-center">
                            <FadeIn>
                                <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                    Over Fixzt
                                </div>
                            </FadeIn>

                            <SlideIn direction="down">
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                                    {c(content, 'hero', 'title', 'Maak kennis met Fixzt')}
                                </h1>
                            </SlideIn>

                            <FadeIn delay={0.2}>
                                <p className="mx-auto max-w-[800px] text-lg text-muted-foreground md:text-xl">
                                    {c(content, 'hero', 'description', 'Full-service dienstverlener voor commercieel vastgoed onderhoud. Uw betrouwbare partner voor dagelijks onderhoud, preventieve service en spoedinterventies.')}
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* Mission Section with Image */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <SlideIn direction="left">
                                <div className="space-y-6">
                                    <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                        Onze Missie
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        {c(content, 'mission', 'title', 'Gebouwen in Topconditie Houden')}
                                    </h2>
                                    <div className="space-y-4">
                                        <p className="text-muted-foreground md:text-lg">
                                            {c(content, 'mission', 'paragraph_1', 'Bij Fixzt zijn wij toegewijd aan het in optimale technische staat houden van uw commerciële vastgoed. Wij begrijpen dat goed onderhoud essentieel is voor de waarde van uw pand en het comfort van uw huurders.')}
                                        </p>
                                        <p className="text-muted-foreground md:text-lg">
                                            {c(content, 'mission', 'paragraph_2', 'Als vaste aanwezigheid in gebouwen zijn wij het eerste aanspreekpunt voor huurders en zorgen we voor directe oplossingen. Onze preventieve aanpak voorkomt grote problemen en zorgt ervoor dat vastgoedbeheerders, eigenaren en investeerders volledig ontzorgd worden met één betrouwbare, vaste partner.')}
                                        </p>
                                    </div>
                                    <Button size="lg">
                                        Leer Meer Over Onze Diensten
                                    </Button>
                                </div>
                            </SlideIn>

                            <SlideIn direction="right">
                                <FloatingElement>
                                    <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl md:h-[500px]">
                                        <img
                                            src={c(content, 'mission', 'image', '/about.jpg')}
                                            alt="Fixzt Facility Management"
                                            className="h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                </FloatingElement>
                            </SlideIn>
                        </div>
                    </div>
                </section>

                {/* Achievements Counter */}
                <section className="w-full bg-primary py-16 text-primary-foreground">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {achievements.map((achievement, index) => (
                                <FadeIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        className="text-center"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="mb-2 text-4xl">
                                            {achievement.icon}
                                        </div>
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
                                            {achievement.number}
                                        </motion.div>
                                        <div className="text-sm opacity-90 md:text-base">
                                            {achievement.label}
                                        </div>
                                    </motion.div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    {c(content, 'values', 'title', 'Onze Kernwaarden')}
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    {c(content, 'values', 'subtitle', 'De principes die onze service en aanpak bepalen')}
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {values.map((value, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="h-full border-2 transition-colors hover:border-primary/50">
                                            <CardHeader className="text-center">
                                                <motion.div
                                                    className="mb-4 text-5xl"
                                                    whileHover={{
                                                        rotate: 360,
                                                        scale: 1.2,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    {value.icon}
                                                </motion.div>
                                                <CardTitle>
                                                    {value.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-center text-sm text-muted-foreground">
                                                    {value.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Fixzt Section */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="mb-16 text-center">
                                <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                    {c(content, 'why_fixzt', 'title', 'Waarom Fixzt?')}
                                </h2>
                                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                                    {c(content, 'why_fixzt', 'subtitle', 'Uw betrouwbare partner voor technisch gebouwbeheer')}
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {services.map((member, index) => (
                                <ScaleIn key={index} delay={index * 0.1}>
                                    <motion.div
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="h-full overflow-hidden transition-shadow hover:shadow-xl">
                                            <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                                <motion.div
                                                    className="text-6xl"
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    {member.icon}
                                                </motion.div>
                                                <div className="absolute right-2 bottom-2 rounded bg-background/80 px-2 py-1 text-xs text-muted-foreground">
                                                    {member.image}
                                                </div>
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    {member.role}
                                                </CardTitle>
                                                <CardDescription>
                                                    {member.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </ScaleIn>
                            ))}
                        </div>

                        <FadeIn delay={0.5}>
                            <div className="mx-auto mt-16 max-w-3xl">
                                <Card className="border-2 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-2xl">
                                            Onze Toegevoegde Waarde
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-2xl">
                                                🏢
                                            </div>
                                            <div>
                                                <h4 className="mb-1 font-semibold">
                                                    Vaste Aanwezigheid in
                                                    Gebouwen
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Wij zijn er fysiek, waardoor
                                                    we snel kunnen handelen en
                                                    problemen direct kunnen
                                                    signaleren
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-2xl">
                                                👥
                                            </div>
                                            <div>
                                                <h4 className="mb-1 font-semibold">
                                                    Direct Contact met Huurders
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Als eerste aanspreekpunt
                                                    zorgen wij voor snelle
                                                    communicatie en hoge
                                                    klanttevredenheid
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-2xl">
                                                🔧
                                            </div>
                                            <div>
                                                <h4 className="mb-1 font-semibold">
                                                    Technische Expertise
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Ons team beschikt over alle
                                                    technische kennis voor
                                                    optimaal gebouwbeheer
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 text-2xl">
                                                🛡️
                                            </div>
                                            <div>
                                                <h4 className="mb-1 font-semibold">
                                                    Preventieve Aanpak
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Door preventief onderhoud
                                                    voorkomen wij grote
                                                    problemen en kostbare
                                                    reparaties
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full bg-gradient-to-br from-primary to-primary/80 py-16 text-primary-foreground md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 md:px-6">
                        <FadeIn>
                            <div className="flex flex-col items-center space-y-6 text-center">
                                <div className="max-w-[700px] space-y-4">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        {c(content, 'cta', 'title', 'Klaar Voor Professioneel Gebouwbeheer?')}
                                    </h2>
                                    <p className="text-lg text-primary-foreground/90 md:text-xl">
                                        {c(content, 'cta', 'description', 'Laten we bespreken hoe wij uw vastgoed optimaal kunnen onderhouden en uw huurders kunnen ontzorgen')}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <ContactButton
                                        size="lg"
                                        variant="secondary"
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
                                                className="border-primary-foreground bg-transparent px-8 text-lg text-primary-foreground hover:bg-primary-foreground/10"
                                            >
                                                Bekijk Onze Diensten
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
