import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  ShoppingBag,
  Instagram,
  Plus,
  Minus,
  X,
  ArrowUpRight,
  ArrowDown,
  Check,
  Skull,
  Zap,
  Flame,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Seo from '@/components/Seo';
import {
  products,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
  HERO_IMAGE,
  FABRIC_IMAGE,
} from '@/data/products';
import pocketbaseClient from '@/lib/pocketbaseClient';

const formatPrice = (n) => `${n} €`;

function ProductCard({ product, onAdd, index }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product, size);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      className={`group flex flex-col ${index % 3 === 1 ? 'lg:mt-16' : ''}`}
    >
      <div className="clip-torn relative overflow-hidden bg-ash ring-1 ring-inset ring-bone/10">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover grayscale-[0.35] contrast-125 transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
        />
        <span className="absolute left-3 top-3 bg-blood px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-bone">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="tape absolute -right-3 bottom-4 -rotate-12 px-3 py-1 font-display text-xl italic text-bone">
          ∞
        </span>
      </div>

      <div className="flex items-start justify-between gap-3 pt-4">
        <div>
          <h3 className="font-display text-3xl leading-none text-bone">
            {product.name}
          </h3>
          <p className="pt-1 text-[11px] uppercase tracking-[0.18em] text-bone/45">
            {product.detail}
          </p>
        </div>
        <p className="font-display text-3xl leading-none text-blood">
          {formatPrice(product.price)}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-3">
        {product.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            className={`min-h-[36px] min-w-[40px] border px-2 text-xs uppercase tracking-widest transition-colors duration-150 ${
              size === s
                ? 'border-blood bg-blood text-bone'
                : 'border-bone/20 bg-transparent text-bone/70 hover:border-blood hover:text-blood'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className={`mt-4 flex min-h-[44px] items-center justify-center gap-2 border-2 px-4 text-xs font-bold uppercase tracking-[0.25em] transition-all duration-150 active:scale-[0.98] ${
          added
            ? 'border-blood bg-blood text-bone'
            : 'border-bone bg-transparent text-bone hover:bg-blood hover:border-blood hover:text-bone'
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2} /> Añadido
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" strokeWidth={2} /> Añadir
          </>
        )}
      </button>
    </article>
  );
}

function CartDrawer({ open, onOpenChange, cart, updateQty, removeItem }) {
  const [submitting, setSubmitting] = useState(false);

  const total = cart.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const finalizeOrder = async () => {
    if (submitting) return;
    setSubmitting(true);
    const items = cart.map((item) => {
      const p = products.find((pr) => pr.id === item.id);
      return { name: p.name, size: item.size, qty: item.qty, price: p.price };
    });
    try {
      await pocketbaseClient.collection('orders').create({
        items,
        total,
        status: 'nuevo',
      });
    } catch {
      // aunque falle el guardado, redirigimos para que el cliente coordine
    }
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    setSubmitting(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="grain flex w-full flex-col border-l-2 border-blood bg-coal p-0 text-bone sm:max-w-md"
      >
        <SheetHeader className="border-b border-bone/15 px-6 py-5">
          <SheetTitle className="flex items-center gap-3 font-display text-4xl font-normal text-bone">
            Carrito
            <span className="bg-blood px-2 py-0.5 font-sans text-xs font-bold uppercase tracking-[0.25em] text-bone">
              {cart.reduce((n, i) => n + i.qty, 0)}
            </span>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Skull className="h-12 w-12 text-blood/60" strokeWidth={1.5} />
            <p className="font-display text-3xl text-bone">
              El carrito está muerto
            </p>
            <p className="max-w-[26ch] text-sm text-bone/50">
              Revisa la colección, elige tus prendas y vuelve a sellar el
              pedido.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {cart.map((item) => {
                const p = products.find((pr) => pr.id === item.id);
                if (!p) return null;
                return (
                  <div
                    key={item.key}
                    className="flex gap-4 border-b border-bone/10 py-4"
                  >
                    <div className="clip-torn h-24 w-20 shrink-0 overflow-hidden bg-ash">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-cover grayscale-[0.4] contrast-125"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-display text-xl leading-tight text-bone">
                            {p.name}
                          </p>
                          <p className="pt-0.5 text-[11px] uppercase tracking-[0.18em] text-bone/45">
                            Talla {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          aria-label={`Quitar ${p.name}`}
                          className="p-1 text-bone/40 transition-colors hover:text-blood"
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-bone/25">
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, -1)}
                            aria-label="Quitar una unidad"
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-blood hover:text-bone"
                          >
                            <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.key, 1)}
                            aria-label="Añadir una unidad"
                            className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-blood hover:text-bone"
                          >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                          </button>
                        </div>
                        <p className="font-display text-xl text-blood">
                          {formatPrice(p.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-bone/15 px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-[0.25em] text-bone/50">
                  Total
                </span>
                <span className="font-display text-4xl text-blood">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={finalizeOrder}
                disabled={submitting}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 bg-blood px-4 text-xs font-bold uppercase tracking-[0.25em] text-bone transition-all duration-150 hover:bg-rust active:scale-[0.98] disabled:opacity-60"
              >
                <Instagram className="h-4 w-4" strokeWidth={2} />
                {submitting ? 'Enviando pedido…' : 'Finalizar en Instagram'}
              </button>
              <p className="pt-3 text-center text-[11px] leading-relaxed text-bone/40">
                Tu pedido se nos envía solo al finalizar; te llevamos a{' '}
                {INSTAGRAM_HANDLE} para coordinar pago y envío.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default function HomePage() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const addToCart = (product, size) => {
    const key = `${product.id}|${size}`;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { key, id: product.id, size, qty: 1 }];
    });
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (key) =>
    setCart((prev) => prev.filter((i) => i.key !== key));

  const openInstagram = () =>
    window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');

  return (
    <div className="grain min-h-screen bg-coal font-sans text-bone antialiased">
      <Helmet>
        <title>angura — edición ilimitada · underground</title>
        <meta
          name="description"
          content="angura: ropa de edición ilimitada, actitud underground. Sin drops, sin agotados. Arma tu carrito y cierra el pedido por Instagram."
        />
      </Helmet>
      <Seo
        title="angura — edición ilimitada · underground"
        description="Ropa de edición ilimitada con actitud underground. Arma tu carrito y cierra el pedido por Instagram."
        image={HERO_IMAGE}
        siteName="angura"
      />

      {/* Riel vertical izquierdo (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-14 flex-col items-center justify-between border-r border-bone/15 bg-coal/90 py-6 lg:flex">
        <a
          href="#inicio"
          className="font-display text-2xl leading-none text-bone [writing-mode:vertical-rl] rotate-180"
        >
          angura
        </a>
        <nav className="flex flex-col items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-bone/60">
          <a
            href="#coleccion"
            className="rotate-180 transition-colors hover:text-blood [writing-mode:vertical-rl]"
          >
            Colección
          </a>
          <a
            href="#manifiesto"
            className="rotate-180 transition-colors hover:text-blood [writing-mode:vertical-rl]"
          >
            Manifiesto
          </a>
          <a
            href="#como-comprar"
            className="rotate-180 transition-colors hover:text-blood [writing-mode:vertical-rl]"
          >
            Comprar
          </a>
        </nav>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Abrir carrito"
          className="relative flex h-11 w-11 items-center justify-center border border-bone/25 transition-colors hover:bg-blood hover:border-blood hover:text-bone"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-blood text-[10px] font-bold text-bone">
              {cartCount}
            </span>
          )}
        </button>
      </aside>

      {/* Barra superior móvil */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-bone/15 bg-coal/90 px-5 py-3 lg:hidden">
        <a href="#inicio" className="font-display text-3xl leading-none text-bone">
          angura
        </a>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Abrir carrito"
          className="relative flex h-11 w-11 items-center justify-center border border-bone/25"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-blood text-[10px] font-bold text-bone">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <main className="lg:pl-14">
        {/* HERO */}
        <section
          id="inicio"
          className="relative flex min-h-[100dvh] items-end overflow-hidden lg:items-center"
        >
          <div className="absolute inset-y-0 right-0 w-full lg:w-[62vw]">
            <img
              src={HERO_IMAGE}
              alt="Modelo con hoodie negro de angura"
              className="clip-torn-bottom h-full w-full object-cover object-top grayscale-[0.5] contrast-125 lg:scale-110 lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-coal/40 to-coal" />
          </div>

          <div className="relative z-10 w-full px-5 pb-10 pt-28 sm:px-10 lg:px-16 lg:py-0">
            <div className="relative max-w-xl border-l-2 border-blood bg-coal/80 p-7 backdrop-blur-sm sm:p-10">
              <span className="tape absolute -right-4 -top-5 rotate-6 px-4 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-bone">
                No rules · no drops
              </span>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-blood">
                <Skull className="h-4 w-4" strokeWidth={2} />
                Edición ilimitada · sin drops
              </p>
              <h1 className="pt-5 font-display text-[20vw] leading-[0.85] sm:text-7xl lg:text-8xl">
                Ropa de
                <br />
                <span className="text-stroke">edición</span>
                <br />
                <span className="text-blood">ilimitada</span>
              </h1>
              <p className="max-w-[42ch] pt-6 text-sm leading-relaxed text-bone/70">
                En angura no hay series limitadas ni agotados que caducan.
                Reeditamos cada prenda mientras alguien la siga queriendo.
                Underground, sin caducidad.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-7">
                <a
                  href="#coleccion"
                  className="flex min-h-[52px] items-center gap-2 bg-blood px-6 text-xs font-bold uppercase tracking-[0.25em] text-bone transition-all duration-150 hover:bg-rust active:scale-[0.98]"
                >
                  Ver colección
                  <ArrowDown className="h-4 w-4" strokeWidth={2} />
                </a>
                <button
                  type="button"
                  onClick={openInstagram}
                  className="flex min-h-[52px] items-center gap-2 border-2 border-bone px-6 text-xs font-bold uppercase tracking-[0.25em] text-bone transition-all duration-150 hover:border-blood hover:text-blood active:scale-[0.98]"
                >
                  {INSTAGRAM_HANDLE}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Banda roja rasgada */}
        <div className="clip-torn-top h-10 w-full bg-blood lg:h-14" />

        {/* Marquee punk */}
        <div className="overflow-hidden border-y-2 border-blood bg-coal py-3">
          <div className="marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-6 pr-6">
                {[
                  'SIN DROPS',
                  'SIN AGOTADOS',
                  'EDICIÓN ILIMITADA',
                  'HECHO BAJO PEDIDO',
                  'UNDERGROUND',
                  'ANGURA',
                  '∞',
                ].map((w, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="flex items-center gap-6 font-display text-2xl uppercase tracking-[0.15em] text-bone"
                  >
                    {w}
                    <Skull className="h-5 w-5 text-blood" strokeWidth={2} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* COLECCIÓN */}
        <section id="coleccion" className="px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b-2 border-bone pb-6">
            <h2 className="font-display text-6xl leading-none text-bone sm:text-7xl">
              La <span className="italic text-blood">colección</span>
            </h2>
            <p className="max-w-[30ch] text-xs uppercase leading-relaxed tracking-[0.25em] text-bone/45">
              06 prendas · siempre disponibles · tallas S—XL
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} index={i} />
            ))}
          </div>
        </section>

        {/* MANIFIESTO */}
        <section id="manifiesto" className="relative overflow-hidden bg-bone text-coal">
          <div className="blood-splat pointer-events-none absolute -left-10 top-10 h-40 w-40 opacity-30" />
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center px-5 py-20 sm:px-10 lg:px-16 lg:py-32">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.35em] text-blood">
                <Flame className="h-4 w-4" strokeWidth={2} />
                Manifiesto
              </p>
              <p className="pt-6 font-display text-4xl leading-[1.05] sm:text-5xl">
                Lo limitado crea escasez.
                <br />
                <span className="italic text-blood">
                  Lo ilimitado crea comunidad.
                </span>
              </p>
              <p className="max-w-[48ch] pt-8 text-sm leading-relaxed text-coal/70">
                Cada prenda de angura se corta, cose y pespuntea bajo pedido y
                se vuelve a producir tantas veces como haga falta. Sin
                reventa, sin cuenta atrás, sin miedo a quedarte fuera. La
                percha es tuya cuando tú decidas.
              </p>
              <div className="flex gap-10 pt-10">
                <div>
                  <p className="font-display text-5xl text-blood">∞</p>
                  <p className="pt-1 text-[10px] uppercase tracking-[0.25em] text-coal/55">
                    Reediciones
                  </p>
                </div>
                <div>
                  <p className="font-display text-5xl text-blood">0</p>
                  <p className="pt-1 text-[10px] uppercase tracking-[0.25em] text-coal/55">
                    Drops cerrados
                  </p>
                </div>
                <div>
                  <p className="font-display text-5xl text-blood">240</p>
                  <p className="pt-1 text-[10px] uppercase tracking-[0.25em] text-coal/55">
                    Gramos algodón
                  </p>
                </div>
              </div>
            </div>
            <div className="relative min-h-[320px] lg:min-h-0">
              <img
                src={FABRIC_IMAGE}
                alt="Detalle de algodón negro con pespunte rojo"
                loading="lazy"
                className="clip-torn absolute inset-0 h-full w-full object-cover grayscale-[0.3] contrast-125 lg:scale-110"
              />
            </div>
          </div>
        </section>

        {/* CÓMO COMPRAR */}
        <section
          id="como-comprar"
          className="px-5 py-20 sm:px-10 lg:px-16 lg:py-28"
        >
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-6xl leading-none text-bone sm:text-7xl">
              Cómo <span className="italic text-blood">comprar</span>
            </h2>
            <p className="max-w-[32ch] text-xs uppercase leading-relaxed tracking-[0.25em] text-bone/45">
              El pedido se cierra por mensaje directo
            </p>
          </div>

          <div className="pt-12">
            {[
              {
                n: '01',
                t: 'Elige prenda y talla',
                d: 'Recorre la colección y selecciona tu talla en cada prenda. Todo está siempre disponible.',
              },
              {
                n: '02',
                t: 'Arma tu carrito',
                d: 'Añade tantas prendas como quieras y revisa el total en el carrito, sin sorpresas.',
              },
              {
                n: '03',
                t: 'Cierra por Instagram',
                d: `Al finalizar te redirigimos a ${INSTAGRAM_HANDLE}. Tu pedido se nos envía solo y coordinamos pago y envío contigo por DM.`,
              },
            ].map((step) => (
              <div
                key={step.n}
                className="grid gap-3 border-t border-bone/20 py-8 sm:grid-cols-[80px_1fr_2fr] sm:items-baseline sm:gap-8"
              >
                <span className="bg-blood px-2 py-1 text-center text-xs font-bold tracking-[0.25em] text-bone">
                  {step.n}
                </span>
                <h3 className="font-display text-3xl leading-none text-bone">
                  {step.t}
                </h3>
                <p className="max-w-[52ch] text-sm leading-relaxed text-bone/65">
                  {step.d}
                </p>
              </div>
            ))}
            <div className="border-t border-bone/20" />
          </div>
        </section>

        {/* BANDA INSTAGRAM */}
        <div className="overflow-hidden border-y-2 border-blood bg-coal py-2">
          <div className="marquee marquee-rev">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-6 pr-6">
                {[
                  'PEDIDOS POR DM',
                  'ANGURA.STOR3',
                  'PAGO · ENVÍO · CIUDAD',
                  'UNDERGROUND',
                  '∞',
                ].map((w, i) => (
                  <span
                    key={`${dup}-${i}`}
                    className="flex items-center gap-6 font-display text-xl uppercase tracking-[0.2em] text-blood"
                  >
                    {w}
                    <Zap className="h-4 w-4 text-bone" strokeWidth={2} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <section className="clip-torn-top relative bg-blood px-5 py-20 text-bone sm:px-10 lg:px-16 lg:py-28">
          <div className="flex flex-col items-start gap-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-bone/70">
              Pedidos · dudas · envíos
            </p>
            <button
              type="button"
              onClick={openInstagram}
              className="group flex items-center gap-4 text-left"
            >
              <span className="font-display text-[18vw] italic leading-none transition-transform duration-200 group-hover:-translate-y-1 sm:text-8xl lg:text-9xl">
                {INSTAGRAM_HANDLE}
              </span>
              <ArrowUpRight
                className="h-10 w-10 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 sm:h-16 sm:w-16"
                strokeWidth={1.5}
              />
            </button>
            <p className="max-w-[46ch] text-sm leading-relaxed text-bone/80">
              Toda la conversación pasa por Instagram: ahí confirmamos tu
              pedido, el pago y el envío a tu ciudad.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-coal px-5 py-12 text-bone sm:px-10 lg:px-16">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-5xl italic leading-none text-bone">
                angura
              </p>
              <p className="pt-3 text-[11px] uppercase tracking-[0.3em] text-bone/45">
                Edición ilimitada · hecha bajo pedido
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.25em] text-bone/65">
              <a href="#coleccion" className="transition-colors hover:text-blood">
                Colección
              </a>
              <a href="#manifiesto" className="transition-colors hover:text-blood">
                Manifiesto
              </a>
              <a
                href="#como-comprar"
                className="transition-colors hover:text-blood"
              >
                Comprar
              </a>
              <button
                type="button"
                onClick={openInstagram}
                className="uppercase tracking-[0.25em] transition-colors hover:text-blood"
              >
                Instagram
              </button>
            </nav>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-bone/15 pt-6 text-[10px] uppercase tracking-[0.25em] text-bone/35">
            <span>© {new Date().getFullYear()} angura</span>
            <span>Sin drops · sin agotados · sin prisa</span>
          </div>
        </footer>
      </main>

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
      />
    </div>
  );
}
