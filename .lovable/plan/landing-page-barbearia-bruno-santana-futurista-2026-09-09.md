# Landing Page — Barbearia "Bruno Santana" (Futurista)

Single-page, dark + gold, high-tech/geométrica. Construída sobre o stack existente (TanStack Start + Tailwind v4 + lucide-react).

## Direção visual (já decidida pelo usuário)
- **Paleta:** fundos pretos/carvão (#000, #0a0a0a, #141414, #1c1c1c) + dourado de destaque (#c9a84c / #f0d78c).
- **Tipografia:** geométrica high-tech — `Space Grotesk` (títulos) + `Inter` (corpo), carregadas via `<link>` no head da root route.
- **Estilo:** sofisticado, futurista, com bordas sutis douradas, glow sutil, cantos levemente arredondados.
- **Animações:** fade-in on scroll (Intersection Observer), hover scale nos cards.

## Decisões confirmadas com o usuário
- **Foto do Bruno:** usar o retrato enviado na seção "Sobre Mim" (via Lovable Assets pointer a partir de `/mnt/user-uploads/`).
- **WhatsApp:** número real `(11) 92013-7736` → formato internacional `5511920137736`.
- **Vitrine:** em **abas (Tabs)** — Serviços / Produtos.

## O que será construído

### Tokens de design (`src/styles.css`)
- Adicionar tokens dourados e de superfície escura em `:root`/`.dark` + `@theme inline`:
  `--gold`, `--gold-soft`, `--charcoal`, `--charcoal-2`, mapeando para `bg-gold`, `text-gold`, `border-gold`, etc.
- Fontes registradas: `--font-display: "Space Grotesk"`, `--font-sans: "Inter"`.

### Rota e metadata
- Reescrever `src/routes/index.tsx` como a landing page completa (single page, scroll fluido por âncoras).
- Adicionar `head()` próprio em `index.tsx`: título "Bruno Santana — O Futuro do Seu Estilo", descrição, og/twitter.
- Atualizar `__root.tsx` head para não conflitar (manter genérico; index define o seu).

### Componentes / seções (tudo em `index.tsx` + pequenos helpers)
1. **Navbar fixa** — logo "BRUNO SANTANA" (dourado), links âncora (Sobre, Serviços, Contato), botão CTA "Agendar" (dourado) → WhatsApp.
2. **Hero** — banner escuro com glow dourado sutil; título grande "O Futuro do Seu Estilo"; subtítulo apresentando o Bruno; CTA dourado principal (role para Serviços) + CTA secundário (WhatsApp).
3. **Sobre Mim** — retrato do Bruno (foto enviada) + texto de história/trajetória/visão.
4. **Vitrine (Tabs)** — Radix Tabs (`Serviços` | `Produtos`):
   - **Serviços:** Corte Degradê, Corte + Barba, Design de Sobrancelha, Pacote Completo. Cada card: imagem, nome, descrição, preço, botão WhatsApp.
   - **Produtos:** Gel Modelador, Creme de Barbear, Pomada Modeladora, Óleo para Barba. Mesma estrutura.
   - Botão de cada item abre `https://api.whatsapp.com/send?phone=5511920137736&text=<mensagem pré-formatada>`:
     - Serviço: `Olá, Bruno! Gostaria de agendar o serviço de [Nome] no valor de [Preço].`
     - Produto: `Olá, Bruno! Tenho interesse em adquirir o produto [Nome] no valor de [Preço].`
5. **Contato/Footer** — endereço/horário placeholder, botão WhatsApp grande, créditos.

### Ícone WhatsApp
- Componente `WhatsAppIcon` (SVG inline), pois lucide-react não traz ícone de marca.

### Imagens ilustrativas
- Gerar via `imagegen` imagens para os itens da vitrine (corte, barba, sobrancelha, pacote, gel, creme, pomada, óleo) — estilo fotográfico escuro/dourado consistente. Salvar em `src/assets/`.

### Animações
- Hook `useInView` (Intersection Observer) para fade-in das seções; `hover-scale` nos cards.

## Notas técnicas
- Sem backend/Lovable Cloud (página estática, sem login nem banco).
- Responsivo: grid de cards 1→2→3 colunas; navbar com menu mobile simples.
- Sem `react-router-dom`; usar âncoras (`#`) e `scroll-behavior: smooth`.

## Entrega
Página única publicada em `/`, pronta para preview, com todos os botões funcionando (WhatsApp com mensagens pré-formatadas).
