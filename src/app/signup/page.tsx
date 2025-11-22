'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Assumindo componentes UI

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        [method]: identifier,
        password,
      });

      if (error) throw error;

      // Após signup, redirecionar para home
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Criar Conta</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Método de cadastro:</label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={method === 'email' ? 'default' : 'outline'}
                onClick={() => setMethod('email')}
                className="flex-1"
              >
                E-mail
              </Button>
              <Button
                type="button"
                variant={method === 'phone' ? 'default' : 'outline'}
                onClick={() => setMethod('phone')}
                className="flex-1"
              >
                Telefone
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {method === 'email' ? 'E-mail' : 'Número de telefone'}
            </label>
            <Input
              type={method === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={method === 'email' ? 'seu@email.com' : '+5511999999999'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Sua senha"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            {loading ? 'Criando...' : 'Criar Conta'}
          </Button>
        </form>
      </div>
    </div>
  );
}