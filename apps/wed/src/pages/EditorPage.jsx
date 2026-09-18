import React, { useState } from 'react';
import { ArrowLeft, ImagePlus, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { resetCatalog, useCatalog } from '@/lib/catalog';
import { useAuth } from '@/contexts/AuthContext';
import { EUR_TO_COP_RATE } from '@/data/products';

const emptyProduct = {
  id: '',
  name: '',
  detail: '',
  price: '',
  sizes: 'S, M, L, XL',
  image: '',
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const inputClass = 'w-full border border-bone/20 bg-black/40 px-3 py-3 text-sm text-bone outline-none transition-colors focus:border-blood';

export default function EditorPage() {
  const [catalog, setCatalog, storageError] = useCatalog();
  const { user, logout } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [notice, setNotice] = useState('');

  const isEditing = Boolean(selectedId);

  const selectProduct = (product) => {
    setSelectedId(product.id);
    setForm({ ...product, price: String(Math.round(product.price * EUR_TO_COP_RATE)), sizes: product.sizes.join(', ') });
    setNotice('');
  };

  const startNew = () => {
    setSelectedId(null);
    setForm(emptyProduct);
    setNotice('');
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const loadImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNotice('Selecciona un archivo de imagen válido.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setNotice('La imagen debe pesar menos de 8 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setNotice('No se pudo leer la imagen.');
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => setNotice('No se pudo procesar la imagen.');
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        updateField('image', canvas.toDataURL('image/jpeg', 0.82));
        setNotice('Imagen cargada.');
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const image = form.image.trim();
    const price = Number(form.price);
    const sizes = form.sizes.split(',').map((size) => size.trim()).filter(Boolean);
    if (!name || !image || !Number.isFinite(price) || price <= 0 || sizes.length === 0) {
      setNotice('Completa nombre, precio mayor que cero, tallas e imagen.');
      return;
    }

    const product = {
      id: selectedId || `${slugify(name)}-${Date.now()}`,
      name,
      detail: form.detail.trim(),
      price: price / EUR_TO_COP_RATE,
      sizes,
      image,
    };

    setCatalog((current) =>
      selectedId
        ? current.map((item) => (item.id === selectedId ? product : item))
        : [...current, product]
    );
    setSelectedId(product.id);
    setForm({ ...product, price: String(Math.round(product.price * EUR_TO_COP_RATE)), sizes: product.sizes.join(', ') });
    setNotice('Producto guardado. Ya aparece en la tienda.');
  };

  const deleteProduct = (id) => {
    if (!window.confirm('¿Eliminar este producto de la tienda?')) return;
    setCatalog((current) => current.filter((product) => product.id !== id));
    if (selectedId === id) startNew();
    setNotice('Producto eliminado.');
  };

  const restoreDefaults = () => {
    if (window.confirm('Esto borrará tus cambios locales y restaurará el catálogo original.')) resetCatalog();
  };

  return (
    <div className="grain min-h-screen bg-coal font-sans text-bone antialiased">
      <header className="border-b border-bone/15 px-5 py-5 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href={`${import.meta.env.BASE_URL}store`} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-bone/70 transition-colors hover:text-blood">
            <ArrowLeft className="h-4 w-4" /> Volver a la tienda
          </a>
          <div className="flex items-center gap-4">
            <p className="hidden text-xs text-bone/45 sm:block">{user?.email}</p>
            <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-bone/60 transition-colors hover:text-blood">Salir</button>
            <p className="font-display text-3xl text-bone">angura / editor</p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-16 lg:py-16">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-bone pb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blood">Catálogo local</p>
              <h1 className="pt-2 font-display text-6xl leading-none text-bone">Tus productos</h1>
            </div>
            <button type="button" onClick={startNew} className="inline-flex min-h-[44px] items-center gap-2 border border-bone bg-blood px-4 text-xs font-bold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-rust">
              <Plus className="h-4 w-4" /> Nuevo
            </button>
          </div>

          <div className="grid gap-4 pt-8 sm:grid-cols-2 xl:grid-cols-3">
            {catalog.map((product) => (
              <article key={product.id} className={`border bg-black/30 p-3 transition-colors ${selectedId === product.id ? 'border-blood' : 'border-bone/15'}`}>
                <img src={product.image} alt={product.name} className="aspect-[3/4] w-full object-cover" />
                <div className="flex items-start justify-between gap-3 pt-3">
                  <div>
                    <h2 className="font-display text-2xl leading-none text-bone">{product.name}</h2>
                    <p className="pt-1 text-xs text-bone/50">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(product.price * EUR_TO_COP_RATE)}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-bone/40">{product.sizes.join(' / ')}</span>
                </div>
                <div className="flex gap-2 pt-4">
                  <button type="button" onClick={() => selectProduct(product)} className="inline-flex min-h-[40px] flex-1 items-center justify-center gap-2 border border-bone/25 text-xs font-bold uppercase tracking-widest transition-colors hover:border-blood hover:text-blood">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>
                  <button type="button" onClick={() => deleteProduct(product.id)} aria-label={`Eliminar ${product.name}`} className="flex min-h-[40px] w-10 items-center justify-center border border-bone/25 text-bone/60 transition-colors hover:border-blood hover:text-blood">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit border-l-2 border-blood bg-black/30 p-5 sm:p-7 lg:sticky lg:top-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-blood">{isEditing ? 'Editar prenda' : 'Nueva prenda'}</p>
              <h2 className="pt-2 font-display text-4xl text-bone">Ficha de producto</h2>
            </div>
            {isEditing && <button type="button" onClick={startNew} aria-label="Cerrar edición" className="text-bone/50 hover:text-blood"><X className="h-5 w-5" /></button>}
          </div>

          <form onSubmit={saveProduct} className="space-y-4 pt-6">
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Nombre<input className={inputClass} value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Camiseta Noche" /></label>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Detalle<input className={inputClass} value={form.detail} onChange={(event) => updateField('detail', event.target.value)} placeholder="Algodón pesado · corte boxy" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Precio (COP)<input className={inputClass} type="number" min="0" step="1000" value={form.price} onChange={(event) => updateField('price', event.target.value)} placeholder="126000" /></label>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Tallas<input className={inputClass} value={form.sizes} onChange={(event) => updateField('sizes', event.target.value)} placeholder="S, M, L, XL" /></label>
            </div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">URL de imagen<input className={inputClass} value={form.image.startsWith('data:') ? '' : form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://.../imagen.png" /></label>
            <label className="flex min-h-[46px] cursor-pointer items-center justify-center gap-2 border border-dashed border-bone/30 text-xs font-bold uppercase tracking-widest text-bone/70 transition-colors hover:border-blood hover:text-blood"><ImagePlus className="h-4 w-4" /> Subir imagen<input type="file" accept="image/*" onChange={loadImage} className="sr-only" /></label>
            {form.image && <img src={form.image} alt="Vista previa" className="aspect-[3/4] max-h-72 w-full object-cover" />}
            {storageError && <p className="border border-blood/50 bg-blood/10 px-3 py-2 text-xs text-bone/80">No hay espacio suficiente en este navegador. Usa una imagen más pequeña o una URL externa.</p>}
            {notice && <p className="border border-blood/50 bg-blood/10 px-3 py-2 text-xs text-bone/80">{notice}</p>}
            <button type="submit" className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-blood px-4 text-xs font-bold uppercase tracking-[0.22em] text-bone transition-colors hover:bg-rust"><Save className="h-4 w-4" /> Guardar producto</button>
          </form>

          <button type="button" onClick={restoreDefaults} className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-bone/40 transition-colors hover:text-blood"><RotateCcw className="h-3.5 w-3.5" /> Restaurar catálogo original</button>
          <p className="pt-3 text-[11px] leading-relaxed text-bone/40">Los cambios se guardan en este navegador. Para una tienda pública multiusuario conviene conectar después este editor a PocketBase.</p>
        </aside>
      </main>
    </div>
  );
}
