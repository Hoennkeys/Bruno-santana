import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X, Scissors, Sparkles, MapPin, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { ClipperBackground } from "@/components/ClipperBackground";
import brunoPortrait from "@/assets/bruno-portrait.jpg";
import corteImg from "@/assets/servico-corte.jpg";
import barbaImg from "@/assets/servico-barba.jpg";
import sobrancelhaImg from "@/assets/servico-sobrancelha.jpg";
import pacoteImg from "@/assets/servico-pacote.jpg";
import gelImg from "@/assets/produto-gel.jpg";
import cremeImg from "@/assets/produto-creme.jpg";
import pomadaImg from "@/assets/produto-pomada.jpg";
import oleoImg from "@/assets/produto-oleo.jpg";
import proteseImg from "@/assets/produto-protese.jpg";
import minoxidilImg from "@/assets/produto-minoxidil.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bruno Santana — O Futuro do Seu Estilo" },
      {
        name: "description",
        content:
          "Bruno Santana: barbearia futurista. Cortes, barba, design de sobrancelha e produtos premium com sofisticação e estilo high-tech.",
      },
      { property: "og:title", content: "Bruno Santana — O Futuro do Seu Estilo" },
      {
        property: "og:description",
        content:
          "Barbearia futurista: cortes, barba e produtos premium com sofisticação e estilo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP_NUMBER = "5511920137736";

function waLink(message: string) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}

/* ---------- WhatsApp icon ---------- */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.043zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.767.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.513l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

/* ---------- useInView hook ---------- */
function useInView<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setInView(true);
        obs.unobserve(entry.target);
      }
    }, options ?? { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);
  return { ref, inView };
}

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Data ---------- */
type Item = {
  name: string;
  desc: string;
  price: string;
  img: string;
};

const services: Item[] = [
  {
    name: "Corte",
    desc: "Transição precisa e moderna, feita sob medida para o seu estilo.",
    price: "R$ 50",
    img: corteImg,
  },
  {
    name: "Corte + Barba",
    desc: "Combinação perfeita de corte navalhado e barba alinhada.",
    price: "R$ 80",
    img: barbaImg,
  },
  {
    name: "Design de Sobrancelha",
    desc: "Contorno masculino definido com técnica e precisão.",
    price: "R$ 25",
    img: sobrancelhaImg,
  },
  {
    name: "Pacote Completo",
    desc: "Corte, barba e sobrancelha — a experiência Bruno Santana completa.",
    price: "R$ 100",
    img: pacoteImg,
  },
];

const products: Item[] = [
  {
    name: "Prótese Capilar Premium",
    desc: "Confecção e personalização sob medida com fios naturais de alta densidade.",
    price: "R$ 450",
    img: proteseImg,
  },
  {
    name: "Tônico Minoxidil 5%",
    desc: "Fórmula de alta eficácia para estímulo de crescimento de barba e cabelo.",
    price: "R$ 85",
    img: minoxidilImg,
  },
  {
    name: "Gel Modelador",
    desc: "Fixação forte com brilho controlado para um visual impecável.",
    price: "R$ 35",
    img: gelImg,
  },
  {
    name: "Creme de Barbear",
    desc: "Deslize perfeito e hidratação para um barbear sem irritação.",
    price: "R$ 28",
    img: cremeImg,
  },
  {
    name: "Pomada Modeladora",
    desc: "Acabamento fosco e fixação duradoura para o seu penteado.",
    price: "R$ 40",
    img: pomadaImg,
  },
  {
    name: "Óleo para Barba",
    desc: "Nutre, amacia e dá brilho saudável à barba todos os dias.",
    price: "R$ 32",
    img: oleoImg,
  },
];

/* ---------- Card ---------- */
function ShowcaseCard({ item, type }: { item: Item; type: "servico" | "produto" }) {
  const msg =
    type === "servico"
      ? `Olá, Bruno! Gostaria de agendar o serviço de ${item.name} no valor de ${item.price}.`
      : `Olá, Bruno! Tenho interesse em adquirir o produto ${item.name} no valor de ${item.price}.`;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gold/20 bg-charcoal-2 transition-all duration-300 hover:border-gold/50 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.img}
          alt={item.name}
          width={700}
          height={700}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-2 via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {item.name}
          </h3>
          <span className="shrink-0 rounded-full border border-gold/40 px-3 py-1 text-sm font-semibold text-gold">
            {item.price}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
        <a
          href={waLink(msg)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold-soft"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {type === "servico" ? "Agendar" : "Comprar"}
        </a>
      </div>
    </div>
  );
}

/* ---------- Sections ---------- */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#vitrine" },
    { label: "Contato", href: "#contato" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-charcoal/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#topo" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="font-display text-lg font-bold tracking-widest text-foreground">
            BRUNO <span className="text-gold">SANTANA</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="story-link text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a
            href={waLink("Olá, Bruno! Gostaria de agendar um horário.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gold px-5 py-2 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold-soft"
          >
            Agendar
          </a>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/10 bg-charcoal px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <a
              href={waLink("Olá, Bruno! Gostaria de agendar um horário.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gold px-5 py-2 text-center text-sm font-semibold text-gold-foreground"
            >
              Agendar
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Dynamic Circuit Pattern & Particle Overlay Canvas ---------- */
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle system for golden orbital trail & cyan energy sparks
    const particlesCount = 65;
    const particles = Array.from({ length: particlesCount }, (_, i) => {
      const isCyan = i % 4 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8 - 0.2,
        color: isCyan ? "rgba(0, 229, 255, " : "rgba(212, 175, 55, ",
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 170 + 110,
      };
    });

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.35;

      // Draw subtle orbital ring around scissors position
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 200, 85, Math.PI / 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.stroke();
      ctx.restore();

      // Render floating particles
      particles.forEach((p, idx) => {
        if (idx % 2 === 0) {
          p.orbitAngle += 0.01;
          p.x = centerX + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = centerY + Math.sin(p.orbitAngle) * (p.orbitRadius * 0.45);
        } else {
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        const currentAlpha = (Math.sin(time * 2 + idx) + 1) / 2 * 0.6 + 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha + ")";
        ctx.shadowColor = p.color === "rgba(0, 229, 255, " ? "#00e5ff" : "#d4af37";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-80"
    />
  );
}

function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent pt-24 pb-16"
    >
      {/* Background Digital Circuit Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(circle at 50% 40%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 40%, black 30%, transparent 80%)",
        }}
      />

      {/* Dramatic Dual Neon Ambient Glows behind 3D Scissor */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[140px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(0,229,255,0.12)] blur-[100px]" />

      {/* Canvas for Particle Orbit Trails and Energy Sparks */}
      <HeroCanvas />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        {/* Tagline Badge */}
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-charcoal-2/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold shadow-lg shadow-gold/10 backdrop-blur-md">
            <Scissors className="h-3.5 w-3.5 text-cyan-400" /> BARBEARIA FUTURISTA 3D
          </span>
        </Reveal>

        {/* 3D Scissor Visual Stage Area */}
        <Reveal className="w-full flex justify-center my-6">
          <div className="relative flex items-center justify-center h-48 sm:h-64 w-full">
            {/* Spinning Golden Orbit Rings framing the 3D background scissor */}
            <div className="pointer-events-none absolute h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] rounded-full border border-gold/30 border-dashed animate-spin-orbital" />
            <div className="pointer-events-none absolute h-[300px] w-[300px] sm:h-[360px] sm:w-[360px] rounded-full border border-cyan-400/20 animate-spin-orbital [animation-direction:reverse] [animation-duration:28s]" />
          </div>
        </Reveal>

        {/* Title with gold reflection */}
        <Reveal>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl drop-shadow-[0_4px_20px_rgba(212,175,55,0.25)]">
            BRUNO <span className="text-gold bg-gradient-to-r from-gold via-yellow-200 to-gold bg-clip-text text-transparent">SANTANA</span>
          </h1>
        </Reveal>

        {/* Slogan */}
        <Reveal>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide text-cyan-400/90 sm:text-3xl">
            O Futuro do Seu Estilo
          </h2>
        </Reveal>

        {/* Subtitle Description */}
        <Reveal>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            Uno a alta precisão biomecânica e o design vanguardista a um atendimento exclusivo — sofisticação, atitude e excelência em cada detalhe.
          </p>
        </Reveal>

        {/* Action Buttons */}
        <Reveal>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
            <a
              href="#vitrine"
              className="w-full rounded-lg bg-gold px-8 py-3.5 text-sm font-semibold text-gold-foreground transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 sm:w-auto"
            >
              Ver Serviços & Produtos
            </a>
            <a
              href={waLink("Olá, Bruno! Gostaria de agendar um horário na Barbearia Futurista.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-charcoal-2/60 px-8 py-3.5 text-sm font-semibold text-cyan-300 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:-translate-y-0.5 sm:w-auto"
            >
              <WhatsAppIcon className="h-4 w-4 text-cyan-400" /> Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section id="sobre" className="bg-charcoal py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2">
        <Reveal>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 rounded-3xl border border-gold/20" />
            <div className="overflow-hidden rounded-3xl border border-gold/30">
              <img
                src={brunoPortrait}
                alt="Bruno Santana, barbeiro"
                width={656}
                height={527}
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div>
            <span className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
              Sobre Mim
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Tradição com olhar no futuro
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                Desde o primeiro corte, descobri que a barbearia é mais do que
                uma profissão — é uma forma de transformar a confiança de quem
                senta na minha cadeira. Cada detalhe importa, cada linha
                alinhada conta uma história.
              </p>
              <p>
                Minha trajetória nasceu da paixão por unir o clássico ao
                contemporâneo. Estudei técnicas, refinei o traço e construí um
                estilo próprio, onde a tradição da navalha encontra a estética
                futurista.
              </p>
              <p>
                Na <span className="text-gold">Bruno Santana</span>, você não
                faz só um corte — vive uma experiência completa, pensada para o
                homem moderno que valoriza sofisticação e atitude.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Vitrine() {
  return (
    <section id="vitrine" className="bg-charcoal-2 py-24">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <div className="text-center">
            <span className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
              Vitrine
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Serviços & Produtos
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Escolha, agende ou compre direto pelo WhatsApp. Tudo pensado para
              o seu estilo.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <Tabs defaultValue="servicos" className="mt-10 w-full">
            <TabsList className="mx-auto flex w-full max-w-md rounded-xl border border-gold/20 bg-charcoal p-1">
              <TabsTrigger
                value="servicos"
                className="flex-1 rounded-lg font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow"
              >
                Serviços
              </TabsTrigger>
              <TabsTrigger
                value="produtos"
                className="flex-1 rounded-lg font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:bg-gold data-[state=active]:text-gold-foreground data-[state=active]:shadow"
              >
                Produtos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="servicos" className="mt-8 focus-visible:outline-none">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((item) => (
                  <ShowcaseCard key={item.name} item={item} type="servico" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="produtos" className="mt-8 focus-visible:outline-none">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((item) => (
                  <ShowcaseCard key={item.name} item={item} type="produto" />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}

function Contato() {
  return (
    <section id="contato" className="bg-charcoal py-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Reveal>
          <span className="font-display text-sm font-semibold uppercase tracking-widest text-gold">
            Contato
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Pronto para o próximo nível?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Agende seu horário ou tire dúvidas direto no WhatsApp. Atendimento
            sob hora marcada.
          </p>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-10 grid max-w-xl gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-center gap-3 rounded-xl border border-gold/20 bg-charcoal-2 p-4 text-left">
              <MapPin className="h-5 w-5 shrink-0 text-gold" />
              <span className="text-sm text-muted-foreground">
                São Paulo, SP — Atendimento sob hora marcada
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 rounded-xl border border-gold/20 bg-charcoal-2 p-4 text-left">
              <Clock className="h-5 w-5 shrink-0 text-gold" />
              <span className="text-sm text-muted-foreground">
                Seg–Sáb, 09h às 20h
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <a
            href={waLink("Olá, Bruno! Gostaria de agendar um horário.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-8 py-3.5 text-sm font-semibold text-gold-foreground transition-colors hover:bg-gold-soft"
          >
            <WhatsAppIcon className="h-5 w-5" /> Agendar pelo WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-charcoal py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="font-display text-sm font-bold tracking-widest text-foreground">
            BRUNO <span className="text-gold">SANTANA</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bruno Santana — O Futuro do Seu Estilo.
        </p>
        <a
          href="#topo"
          className="text-xs text-muted-foreground transition-colors hover:text-gold"
        >
          Voltar ao topo ↑
        </a>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen bg-charcoal font-sans text-foreground">
      <ClipperBackground />
      <Navbar />
      <main>
        <Hero />
        <Sobre />
        <Vitrine />
        <Contato />
      </main>
      <Footer />
    </div>
  );
}
