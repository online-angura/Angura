import React, { useEffect, useState } from 'react';
import { ArrowLeft, LockKeyhole, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const inputClass = 'w-full border border-bone/20 bg-black/40 px-3 py-3 text-sm text-bone outline-none transition-colors focus:border-blood';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAdmin, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdmin) navigate('/editor', { replace: true });
  }, [isAdmin, navigate]);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/editor', { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grain flex min-h-screen items-center justify-center bg-coal px-5 py-10 text-bone">
      <main className="w-full max-w-md border-l-2 border-blood bg-black/30 p-6 sm:p-8">
        <a href={`${import.meta.env.BASE_URL}store`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-bone/60 transition-colors hover:text-blood"><ArrowLeft className="h-4 w-4" /> Tienda</a>
        <div className="pt-10"><LockKeyhole className="h-8 w-8 text-blood" /><p className="pt-5 text-[10px] font-bold uppercase tracking-[0.35em] text-blood">Acceso privado</p><h1 className="pt-2 font-display text-6xl leading-none">Editor</h1><p className="pt-4 text-sm text-bone/55">Solo la cuenta administradora puede gestionar el catálogo.</p></div>
        <form onSubmit={submit} className="space-y-4 pt-8">
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Correo<input required type="email" className={inputClass} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-bone/60">Contraseña<input required type="password" className={inputClass} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {error && <p className="border border-blood/60 bg-blood/10 px-3 py-2 text-xs text-bone/80">{error}</p>}
          <button disabled={busy} className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 bg-blood px-4 text-xs font-bold uppercase tracking-[0.22em] text-bone transition-colors hover:bg-rust disabled:opacity-60"><LogIn className="h-4 w-4" /> {busy ? 'Entrando...' : 'Entrar al editor'}</button>
        </form>
        <p className="pt-6 text-xs leading-relaxed text-bone/40">El acceso se configura directamente en el archivo `.env` del proyecto.</p>
      </main>
    </div>
  );
}
