"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerContainer,
  FloatingElement,
} from "@/components/animations";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      title: "Full-Service Onderhoud",
      description: "Eén partij voor alle onderhoudswerkzaamheden",
      icon: "🔧",
      content:
        "Van kleine reparaties tot preventief onderhoud - wij zijn uw vaste, betrouwbare partner voor alle onderhoudsklussen in commercieel vastgoed.",
    },
    {
      title: "Commercieel Vastgoed Specialist",
      description:
        "Gespecialiseerd in kantoren, winkelcentra en bedrijfsruimtes",
      icon: "🏢",
      content:
        "Wij kennen de specifieke eisen van commercieel vastgoed en zorgen dat uw gebouw technisch in topconditie blijft voor uw huurders.",
    },
    {
      title: "Snelle Respons",
      description: "Direct schakelen bij noodgevallen en acute problemen",
      icon: "⚡",
      content:
        "Uw eerste aanspreekpunt op locatie. Wij zorgen voor snelle respons bij storingen en noodgevallen om grotere problemen te voorkomen.",
    },
  ];

  const stats = [
    { value: "24/7", label: "Bereikbaar" },
    { value: "100+", label: "Beheerde Locaties" },
    { value: "10+", label: "Jaar Ervaring" },
    { value: "98%", label: "Klanttevredenheid" },
  ];

  const targetAudience = [
    {
      title: "Vastgoedbeheerders",
      description: "Ontzorging voor alle dagelijkse onderhoudsklussen",
      icon: "👔",
    },
    {
      title: "Vastgoedeigenaren",
      description: "Technisch beheer om waarde te behouden",
      icon: "🏛️",
    },
    {
      title: "Vastgoedbeleggers",
      description: "Betrouwbaar onderhoud voor uw portfolio",
      icon: "📊",
    },
  ];

  const buildingTypes = [
    {
      title: "Winkelpanden & Winkelcentra",
      description: "Onderhoud voor retail vastgoed",
      image: "/building-retail.jpg",
    },
    {
      title: "Kantoorgebouwen",
      description: "Facility management voor kantoren",
      image: "/building-office.jpg",
    },
    {
      title: "Light Industrial & Bedrijfsruimtes",
      description: "Technisch onderhoud bedrijfspanden",
      image: "/building-industrial.jpg",
    },
    {
      title: "Zorglocaties",
      description: "Betrouwbaar onderhoud zorginstellingen",
      image: "/building-care.jpg",
    },
    {
      title: "Hotels",
      description: "Continue inzetbaarheid horecavastgoed",
      image: "/building-hotel.jpg",
    },
    {
      title: "Wooncomplexen",
      description: "Complexmatig beheer woongebouwen",
      image: "/building-residential.jpg",
    },
  ];

  const services = [
    {
      step: "01",
      title: "Kleine Reparaties & Dagelijks Onderhoud",
      description:
        "Van lekkende kranen tot kapotte deurknoppen - alle kleine klussen die dagelijks voorkomen in commercieel vastgoed.",
    },
    {
      step: "02",
      title: "Preventief Onderhoud & Inspecties",
      description:
        "Regelmatige controles en preventief onderhoud om grotere problemen en kostbare storingen te voorkomen.",
    },
    {
      step: "03",
      title: "Snelle Respons & Noodgevallen",
      description:
        "24/7 bereikbaar voor acute storingen. Wij schakelen snel om downtime te minimaliseren en uw huurders tevreden te houden.",
    },
    {
      step: "04",
      title: "Eerste Aanspreekpunt op Locatie",
      description:
        "Uw ogen en oren ter plaatse. Wij signaleren problemen tijdig en denken proactief mee in onderhoudsbeheer.",
    },
    {
      step: "05",
      title: "Kleine Projecten & Vervangingswerk",
      description:
        "Ook voor kleinschalige renovaties en vervangingen kunt u bij ons terecht - zonder de overhead van grote aannemers.",
    },
  ];

  const testimonials = [
    {
      name: "Peter van der Meer",
      role: "Vastgoedbeheerder",
      content:
        "Fixzt denkt mee en pakt zaken direct op. Sinds wij met hen werken zijn onze huurders een stuk tevredener over het technisch onderhoud.",
      rating: 5,
    },
    {
      name: "Linda Bakker",
      role: "Property Manager Winkelcentrum",
      content:
        "Eindelijk één partij voor alle kleine klussen. Fixzt is betrouwbaar, reageert snel en werkt netjes. Precies wat je nodig hebt in een druk winkelcentrum.",
      rating: 5,
    },
    {
      name: "Mark Jansen",
      role: "Vastgoedbelegger",
      content:
        "Voor mijn kantoorpanden is Fixzt onmisbaar. Ze houden alles in topconditie en voorkomen dat kleine problemen grote reparaties worden.",
      rating: 5,
    },
  ];

  const whyFixzt = [
    {
      title: "Full-Service",
      description: "Eén partij voor alle onderhoudswerkzaamheden",
      icon: "✓",
      content:
        "Geen gedoe met verschillende leveranciers. Wij regelen alles - van elektra tot sanitair, van schilderwerk tot kleine verbouwingen.",
    },
    {
      title: "Commercieel Vastgoed als Specialisatie",
      description: "Wij begrijpen uw vastgoed",
      icon: "✓",
      content:
        "Jarenlange ervaring met kantoren, winkelcentra en bedrijfspanden. Wij kennen de eisen en werken discreet tijdens openingstijden.",
    },
    {
      title: "Snelle Respons",
      description: "Direct schakelen wanneer nodig",
      icon: "✓",
      content:
        "Storing? Lekkage? Wij zijn er snel. Minimale downtime betekent tevreden huurders en behoud van waarde.",
    },
    {
      title: "Preventief én Correctief",
      description: "Problemen voorkomen én oplossen",
      icon: "✓",
      content:
        "Regelmatige inspecties en preventief onderhoud voorkomen grotere problemen. En als er toch iets misgaat, lossen wij het snel op.",
    },
    {
      title: "Ogen en Oren op Locatie",
      description: "Proactief meedenken",
      icon: "✓",
      content:
        "Tijdens onderhoudswerkzaamheden signaleren wij mogelijke toekomstige problemen en adviseren wij proactief over verbeteringen.",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section with Animation */}
      <section className="relative w-full py-10 md:py-12 lg:py-20 xl:py-24 overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <FadeIn>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                  Full-Service Onderhoud Commercieel Vastgoed
                </div>
              </FadeIn>

              <SlideIn direction="right">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Uw Gebouw Technisch in Topconditie
                </h1>
              </SlideIn>

              <SlideIn direction="right" delay={0.2}>
                <p className="text-lg md:text-xl text-muted-foreground max-w-[600px]">
                  Fixzt ondersteunt vastgoedbeheerders, eigenaren en beleggers
                  bij alle kleine reparaties, dagelijks onderhoud en
                  terugkerende klussen in kantoorgebouwen, winkelcentra en
                  andere commerciële panden. Eén vaste, betrouwbare partij.
                </p>
              </SlideIn>

              <SlideIn direction="right" delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/services">
                    <Button size="lg" className="w-full sm:w-auto">
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
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index}>
                      <div className="text-2xl md:text-3xl font-bold text-primary">
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
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/homepage.jpg"
                  alt="Fixzt onderhoud commercieel vastgoed"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm md:text-base opacity-90">
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
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Voor Wie is Fixzt?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Wij ondersteunen professionele partijen in de commerciële
                vastgoedmarkt
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
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="text-4xl mb-4">{audience.icon}</div>
                      <CardTitle>{audience.title}</CardTitle>
                      <CardDescription>{audience.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </ScaleIn>
            ))}
          </div>
        </div>
      </section>

      {/* Building Types */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Type Gebouwen
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Wij verzorgen onderhoud voor diverse commerciële vastgoedtypen
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {buildingTypes.map((building, index) => (
              <SlideIn
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-muted flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2">🏢</div>
                        <p className="text-xs text-muted-foreground">
                          Afbeelding: {building.image}
                        </p>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{building.title}</CardTitle>
                      <CardDescription>{building.description}</CardDescription>
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
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Wat Doen We Precies?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Onze diensten voor optimaal onderhoud van uw commercieel
                vastgoed
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              {services.map((item, index) => (
                <FadeIn key={index} delay={index * 0.1}>
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full relative z-10 bg-background">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4">
                          {item.step}
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Waarom Kiezen voor Fixzt?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Uw betrouwbare partner in commercieel vastgoedonderhoud
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
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader>
                      <div className="text-4xl mb-4 text-primary font-bold">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
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
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Wat Onze Klanten Zeggen
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Vastgoedprofessionals over hun ervaringen met Fixzt
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
                      <div className="flex gap-1 mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ⭐
                          </span>
                        ))}
                      </div>
                      <CardTitle className="text-lg">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription>{testimonial.role}</CardDescription>
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">
                      Blijf Op De Hoogte
                    </h3>
                    <p className="text-primary-foreground/90 mb-6">
                      Ontvang praktische tips voor vastgoedonderhoud,
                      onderhoudsplanningen en updates over onze diensten.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Voer uw e-mailadres in"
                      className="flex-1 px-4 py-3 rounded-md text-foreground"
                    />
                    <Button size="lg" variant="secondary">
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-[800px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Klaar Om Uw Vastgoed Te Ontzorgen?
                </h2>
                <p className="text-muted-foreground md:text-xl">
                  Neem vandaag nog contact met ons op en ontdek hoe Fixzt uw
                  gebouwen in topconditie houdt, uw huurders tevreden stelt en
                  grotere problemen voorkomt.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="text-lg px-8">
                    Neem Contact Op
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/services">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8"
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
  );
}
