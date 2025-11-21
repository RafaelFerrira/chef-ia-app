"use client";

import React from 'react';

export default function Header() {
  return (
    <div className="flex items-center justify-center p-4 bg-orange-500 text-white">
      <img src="/chef-hat.png" alt="Chef Hat" className="w-8 h-8 mr-2" />
      <h1 className="text-2xl font-bold">Chef IA</h1>
    </div>
  );
}