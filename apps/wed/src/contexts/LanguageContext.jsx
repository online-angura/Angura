import React, { createContext, useContext, useMemo, useState } from 'react';

const LANGUAGE_KEY = 'angura-language';
const translations = {
  es: {
    collection: 'Colección',
    manifesto: 'Manifiesto',
    buy: 'Comprar',
    cart: 'Carrito',
    add: 'Añadir',
    added: 'Añadido',
    viewCollection: 'Ver colección',
    underground: 'underground / sin drops',
    hero: 'Ropa de edición ilimitada. Sin caducidad. Sin miedo.',
    collectionTitle: 'La colección',
    alwaysAvailable: '06 prendas · siempre disponibles · tallas S—XL',
    emptyCart: 'El carrito está muerto',
    emptyCartText: 'Revisa la colección, elige tus prendas y vuelve a sellar el pedido.',
    total: 'Total',
    finishInstagram: 'Finalizar en Instagram',
    copied: 'Pedido copiado. Pégalo en el chat de Instagram.',
    copyFailed: 'Instagram abierto. Copia los datos del pedido desde el carrito.',
    language: 'Idioma',
    manifestoTitle: 'Manifiesto',
    limited: 'Lo limitado crea escasez.',
    unlimited: 'Lo ilimitado crea comunidad.',
    manifestoText: 'Cada prenda de angura se corta, cose y pespuntea bajo pedido y se vuelve a producir tantas veces como haga falta. Sin reventa, sin cuenta atrás, sin miedo a quedarte fuera. La percha es tuya cuando tú decidas.',
    reissues: 'Reediciones',
    closedDrops: 'Drops cerrados',
    cotton: 'Gramos algodón',
    howToBuy: 'Cómo comprar',
    dmClose: 'El pedido se cierra por mensaje directo',
    choose: 'Elige prenda y talla',
    chooseText: 'Recorre la colección y selecciona tu talla en cada prenda. Todo está siempre disponible.',
    buildCart: 'Arma tu carrito',
    buildCartText: 'Añade tantas prendas como quieras y revisa el total en el carrito, sin sorpresas.',
    closeInstagram: 'Cierra por Instagram',
    closeInstagramText: 'Al finalizar te redirigimos a Instagram. Tu pedido se prepara para coordinar pago y envío contigo por DM.',
  },
  en: {
    collection: 'Collection',
    manifesto: 'Manifesto',
    buy: 'Buy',
    cart: 'Cart',
    add: 'Add',
    added: 'Added',
    viewCollection: 'View collection',
    underground: 'underground / no drops',
    hero: 'Unlimited edition clothing. No expiry. No fear.',
    collectionTitle: 'The collection',
    alwaysAvailable: '06 pieces · always available · sizes S—XL',
    emptyCart: 'The cart is dead',
    emptyCartText: 'Browse the collection, choose your pieces and seal the order.',
    total: 'Total',
    finishInstagram: 'Finish on Instagram',
    copied: 'Order copied. Paste it into the Instagram chat.',
    copyFailed: 'Instagram opened. Copy the order details from the cart.',
    language: 'Language',
    manifestoTitle: 'Manifesto',
    limited: 'Limited creates scarcity.',
    unlimited: 'Unlimited creates community.',
    manifestoText: 'Every angura piece is cut, sewn and stitched to order, then produced again as many times as needed. No reselling, no countdown, no fear of missing out. The hanger is yours whenever you decide.',
    reissues: 'Reissues',
    closedDrops: 'Closed drops',
    cotton: 'Grams of cotton',
    howToBuy: 'How to buy',
    dmClose: 'Orders close by direct message',
    choose: 'Choose your piece and size',
    chooseText: 'Browse the collection and select your size for each piece. Everything is always available.',
    buildCart: 'Build your cart',
    buildCartText: 'Add as many pieces as you want and review the total in the cart, no surprises.',
    closeInstagram: 'Close on Instagram',
    closeInstagramText: 'At checkout we redirect you to Instagram. Your order is prepared so we can coordinate payment and shipping by DM.',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem(LANGUAGE_KEY);
    return saved === 'en' ? 'en' : 'es';
  });

  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const value = useMemo(
    () => ({ language, setLanguage: changeLanguage, t: translations[language] }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
