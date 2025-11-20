"use client";

import React from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';

export default function HomePage() {
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Barra de Pesquisa */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Pesquisar receitas, ingredientes ou pratos…"
          className="w-full p-3 border border-gray-300 rounded-lg text-lg"
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex items-center justify-center">
        <Link href="/create">
          <button className="bg-orange-500 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg hover:bg-orange-600 transition-colors">
            Criar Receita pela Foto
          </button>
        </Link>
      </div>

      {/* Menu Inferior */}
      <BottomNav />
    </div>
  );
}