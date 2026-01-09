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
  FloatingElement,
} from "@/components/animations";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function About() {
  const values = [
    {
      title: "Betrouwbaar",
      icon: "🤝",
      description:
        "Wij zijn de vaste partner waarop u kunt rekenen. Consistente kwaliteit en betrouwbare service bij elk onderhoud.",
    },
    {
      title: "Snel & Flexibel",
      icon: "⚡",
      description:
        "Direct beschikbaar wanneer u ons nodig heeft. Snelle respons en flexibele planning voor al uw onderhoudswensen.",
    },
    {
      title: "Preventief Denken",
      icon: "🔍",
      description:
        "Wij signaleren problemen voordat ze groot worden. Preventief onderhoud voorkomt dure reparaties en verstoringen.",
    },
    {
      title: "Altijd Bereikbaar",
      icon: "📞",
      description:
        "24/7 beschikbaar voor spoedgevallen. Uw eerste aanspreekpunt op locatie voor alle technische zaken.",
    },
  ];

  const services = [
    {
      role: "Dagelijks Onderhoud",
      icon: "🔧",
      description:
        "Klein reparatiewerk en dagelijks technisch onderhoud van uw gebouwen",
      image: "/team-experts.jpg",
    },
    {
      role: "Preventief Onderhoud",
      icon: "🛡️",
      description:
        "Regelmatige inspecties en preventieve maatregelen om problemen voor te zijn",
      image: "/team-legal.jpg",
    },
    {
      role: "Spoedservice",
      icon: "🚨",
      description:
        "24/7 beschikbaar voor spoedgevallen en technische calamiteiten",
      image: "/team-managers.jpg",
    },
    {
      role: "Kleine Projecten",
      icon: "🏗️",
      description: "Vervangingswerk en kleine projecten binnen uw vastgoed",
      image: "/team-financial.jpg",
    },
  ];

  const achievements = [
    { number: "500+", label: "Panden Beheerd", icon: "🏢" },
    { number: "1000+", label: "Tevreden Huurders", icon: "😊" },
    { number: "15+", label: "Jaar Ervaring", icon: "📅" },
    { number: "24/7", label: "Beschikbaarheid", icon: "⏰" },
  ];

  const timeline = [
    {
      year: "2008",
      title: "Opgericht",
      desc: "Fixzt werd opgericht als specialist in commercieel vastgoed onderhoud",
    },
    {
      year: "2012",
      title: "Uitbreiding",
      desc: "Groei naar meerdere locaties met vaste aanwezigheid in gebouwen",
    },
    {
      year: "2018",
      title: "Digitale Innovatie",
      desc: "Implementatie van geavanceerd onderhoudsmanagement systeem",
    },
    {
      year: "2023",
      title: "Marktleider",
      desc: "Erkend als toonaangevende facility management partner",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <FadeIn>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
                Over Fixzt
              </div>
            </FadeIn>

            <SlideIn direction="down">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Maak kennis met <span className="text-primary">Fixzt</span>
              </h1>
            </SlideIn>

            <FadeIn delay={0.2}>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl">
                Full-service dienstverlener voor commercieel vastgoed onderhoud.
                Uw betrouwbare partner voor dagelijks onderhoud, preventieve
                service en spoedinterventies.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <SlideIn direction="left">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  Onze Missie
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Gebouwen in Topconditie Houden
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground md:text-lg">
                    Bij Fixzt zijn wij toegewijd aan het in optimale technische
                    staat houden van uw commerciële vastgoed. Wij begrijpen dat
                    goed onderhoud essentieel is voor de waarde van uw pand en
                    het comfort van uw huurders.
                  </p>
                  <p className="text-muted-foreground md:text-lg">
                    Als vaste aanwezigheid in gebouwen zijn wij het eerste
                    aanspreekpunt voor huurders en zorgen we voor directe
                    oplossingen. Onze preventieve aanpak voorkomt grote
                    problemen en zorgt ervoor dat vastgoedbeheerders, eigenaren
                    en investeerders volledig ontzorgd worden met één
                    betrouwbare, vaste partner.
                  </p>
                </div>
                <Button size="lg">Leer Meer Over Onze Diensten</Button>
              </div>
            </SlideIn>

            <SlideIn direction="right">
              <FloatingElement>
                <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/about.jpg"
                    alt="Fixzt Facility Management"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </FloatingElement>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Achievements Counter */}
      <section className="w-full py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {achievement.number}
                  </motion.div>
                  <div className="text-sm md:text-base opacity-90">
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
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Onze Kernwaarden
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                De principes die onze service en aanpak bepalen
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
                  <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="text-center">
                      <motion.div
                        className="text-5xl mb-4"
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                      >
                        {value.icon}
                      </motion.div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground text-center">
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

      {/* Timeline Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Onze Reis
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Een erfenis van betrouwbaarheid en groei in facility management
              </p>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-border"></div>

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <SlideIn
                    key={index}
                    direction={index % 2 === 0 ? "left" : "right"}
                    delay={index * 0.1}
                  >
                    <div
                      className={`flex gap-8 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      <div
                        className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                            <CardDescription>{item.desc}</CardDescription>
                          </CardHeader>
                        </Card>
                      </div>
                      <motion.div
                        className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold z-10 relative"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {item.year}
                      </motion.div>
                      <div className="flex-1 hidden md:block"></div>
                    </div>
                  </SlideIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Fixzt Section */}
      <section className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Waarom Fixzt?
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-[800px] mx-auto">
                Uw betrouwbare partner voor technisch gebouwbeheer
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
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <motion.div
                        className="text-6xl"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        {member.icon}
                      </motion.div>
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                        {member.image}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg">{member.role}</CardTitle>
                      <CardDescription>{member.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </ScaleIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-16 max-w-3xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Onze Toegevoegde Waarde
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">🏢</div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Vaste Aanwezigheid in Gebouwen
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Wij zijn er fysiek, waardoor we snel kunnen handelen en
                        problemen direct kunnen signaleren
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">👥</div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Direct Contact met Huurders
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Als eerste aanspreekpunt zorgen wij voor snelle
                        communicatie en hoge klanttevredenheid
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">🔧</div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Technische Expertise
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Ons team beschikt over alle technische kennis voor
                        optimaal gebouwbeheer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl mt-1">🛡️</div>
                    <div>
                      <h4 className="font-semibold mb-1">Preventieve Aanpak</h4>
                      <p className="text-sm text-muted-foreground">
                        Door preventief onderhoud voorkomen wij grote problemen
                        en kostbare reparaties
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
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4 max-w-[700px]">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Klaar Voor Professioneel Gebouwbeheer?
                </h2>
                <p className="text-primary-foreground/90 text-lg md:text-xl">
                  Laten we bespreken hoe wij uw vastgoed optimaal kunnen
                  onderhouden en uw huurders kunnen ontzorgen
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8"
                  >
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
                      className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
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
  );
}
