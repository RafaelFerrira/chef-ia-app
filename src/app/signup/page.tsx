"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Header from '../../components/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [useEmail, setUseEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: useEmail ? email : undefined,
        phone: useEmail ? undefined : phone,
        password,
      });
      if (error) throw error;
      router.push('/quiz');
    } catch (error) {
      alert('Erro ao criar conta: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white justify-center items-center px-6">
      <Header />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Criar Conta</h1>
        <p className="text-lg text-gray-600">Escolha como se registrar</p>
      </div>
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setUseEmail(true)}
            className={`px-4 py-2 rounded-l-lg ${useEmail ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            E-mail
          </button>
          <button
            onClick={() => setUseEmail(false)}
            className={`px-4 py-2 rounded-r-lg ${!useEmail ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Telefone
          </button>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          {useEmail ? (
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              required
            />
          ) : (
            <input
              type="tel"
              placeholder="Número de telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              required
            />
          )}
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
}