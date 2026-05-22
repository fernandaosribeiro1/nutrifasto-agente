"use client";

import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Droplet, Plus } from "lucide-react";

interface WaterTrackerProps {
  user: any;
  selectedDateStr: string;
}

export default function WaterTracker({ user, selectedDateStr }: WaterTrackerProps) {
  const [consumed, setConsumed] = useState(0);
  const dailyGoal = 2000; // Meta padrão de 2 Litros (2000ml)

  // Escuta as alterações de água do dia selecionado em tempo real
  useEffect(() => {
    if (!user || !selectedDateStr) return;

    const waterRef = doc(db, "users", user.uid, "water", selectedDateStr);
    const unsubscribe = onSnapshot(waterRef, (docSnap) => {
      if (docSnap.exists()) {
        setConsumed(docSnap.data().amount || 0);
      } else {
        setConsumed(0);
      }
    });

    return () => unsubscribe();
  }, [user, selectedDateStr]);

  // Função para adicionar água
  const handleAddWater = async (ml: number) => {
    if (!user || !selectedDateStr) return;
    const newAmount = consumed + ml;
    
    // Usamos setDoc com merge: true para criar ou atualizar o documento do dia
    const waterRef = doc(db, "users", user.uid, "water", selectedDateStr);
    await setDoc(waterRef, { amount: newAmount }, { merge: true });
  };

  const progressPercentage = Math.min((consumed / dailyGoal) * 100, 100);

  return (
    <div className="bg-white dark:bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333] flex flex-col justify-between relative overflow-hidden transition-colors">
      {/* Fundo sutil de onda de água */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-blue-50 dark:bg-blue-900/10 transition-all duration-1000 ease-in-out -z-0"
        style={{ height: `${progressPercentage}%`, opacity: 0.5 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm flex items-center gap-2">
            <Droplet size={16} className="text-blue-500" /> Hidratação
          </h3>
          <span className="text-xs font-bold text-gray-400">
            {consumed} / {dailyGoal} ml
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-5 overflow-hidden">
          <div
            className="h-3 rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Botões de Adição Rápida */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAddWater(250)}
            className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold py-2 rounded-xl transition-colors"
          >
            <Plus size={12} /> Copo (250ml)
          </button>
          <button
            onClick={() => handleAddWater(500)}
            className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold py-2 rounded-xl transition-colors"
          >
            <Plus size={12} /> Garrafa (500ml)
          </button>
        </div>
      </div>
    </div>
  );
}