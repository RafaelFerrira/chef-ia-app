"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface ShoppingListProps {
  onBack: () => void;
  darkMode: boolean;
}

interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
}

export default function ShoppingList({ onBack, darkMode }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItem, setNewItem] = useState("");

  // Carregar lista do localStorage
  useEffect(() => {
    const savedList = localStorage.getItem("shoppingList");
    if (savedList) {
      setItems(JSON.parse(savedList));
    } else {
      // Lista inicial padrão
      setItems([
        { id: 1, name: "Açúcar", checked: false },
        { id: 2, name: "Manteiga", checked: false },
        { id: 3, name: "Pimentão", checked: false },
      ]);
    }
  }, []);

  // Salvar lista no localStorage
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        { id: Date.now(), name: newItem.trim(), checked: false },
      ]);
      setNewItem("");
    }
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const clearChecked = () => {
    setItems(items.filter((item) => !item.checked));
  };

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className={`gap-2 border-2 ${
          darkMode 
            ? "border-gray-600 hover:bg-gray-800" 
            : "border-orange-200 hover:bg-orange-50"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      <div className="text-center space-y-2">
        <div className="inline-block bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-2xl mb-2">
          <ShoppingCart className="w-12 h-12 text-white" />
        </div>
        <h2 className={`text-3xl md:text-4xl font-bold ${
          darkMode ? "text-white" : "text-gray-800"
        }`}>
          Lista de Compras
        </h2>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          Adicione ingredientes que você precisa comprar
        </p>
      </div>

      <Card className={`p-6 md:p-8 shadow-xl border-2 ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-orange-100"
      }`}>
        {/* Adicionar Item */}
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Digite um ingrediente..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addItem()}
            className={`flex-1 border-2 ${
              darkMode 
                ? "border-gray-600 bg-gray-700 text-white focus:border-orange-400" 
                : "border-orange-200 focus:border-orange-400"
            }`}
          />
          <Button
            onClick={addItem}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Progresso */}
        {totalCount > 0 && (
          <div className={`mb-6 p-4 rounded-lg border ${
            darkMode 
              ? "bg-blue-900/20 border-blue-700" 
              : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Progresso
              </span>
              <span className={`text-sm font-bold ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}>
                {checkedCount} / {totalCount}
              </span>
            </div>
            <div className={`w-full rounded-full h-3 overflow-hidden border ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-blue-200"
            }`}>
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300"
                style={{
                  width: `${(checkedCount / totalCount) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Lista de Itens */}
        <div className="space-y-2 mb-6">
          {items.length === 0 ? (
            <div className={`text-center py-12 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}>
              <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Sua lista está vazia</p>
              <p className="text-sm">Adicione ingredientes acima</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                  item.checked
                    ? "bg-green-50 border-green-300"
                    : darkMode
                      ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                      : "bg-white border-orange-200 hover:border-orange-300"
                }`}
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                />
                <span
                  className={`flex-1 ${
                    item.checked
                      ? "line-through text-gray-400"
                      : darkMode
                        ? "text-gray-200"
                        : "text-gray-700"
                  }`}
                >
                  {item.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Ações */}
        {checkedCount > 0 && (
          <Button
            onClick={clearChecked}
            variant="outline"
            className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50"
          >
            <Check className="w-4 h-4 mr-2" />
            Remover {checkedCount} {checkedCount === 1 ? "item" : "itens"}{" "}
            marcado{checkedCount === 1 ? "" : "s"}
          </Button>
        )}
      </Card>

      <div className={`rounded-lg p-4 text-sm border ${
        darkMode 
          ? "bg-amber-900/20 border-amber-700 text-amber-300" 
          : "bg-amber-50 border-amber-200 text-amber-800"
      }`}>
        <p className="font-semibold mb-1">💡 Dica:</p>
        <p>
          Marque os itens conforme você os adiciona ao carrinho. Você pode
          remover todos os itens marcados de uma vez!
        </p>
      </div>
    </div>
  );
}
