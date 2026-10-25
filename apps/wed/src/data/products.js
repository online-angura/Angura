import productsJson from './products.json';

export const INSTAGRAM_HANDLE = '@angura.stor3';
export const INSTAGRAM_URL =
  'https://www.instagram.com/angura.stor3?stkn=NnB5eG9nNWdnemh6&utm_source=qr';
export const INSTAGRAM_DM_URL = 'https://ig.me/m/angura.stor3';

export const WHATSAPP_NUMBER = '573239755997';
export const WHATSAPP_CONTACT_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_URL = `${WHATSAPP_CONTACT_URL}?text=`;

export const HERO_IMAGE =
  'https://images.hostinger.com/bace8d35-f8f1-404f-8154-cdbedb6d11e8.png';

export const FABRIC_IMAGE =
  'https://images.hostinger.com/4c94b844-7983-4fb8-8834-2fcd55c173b6.png';

export const products = productsJson.products;

export const resolveImage = (src) => {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
};
