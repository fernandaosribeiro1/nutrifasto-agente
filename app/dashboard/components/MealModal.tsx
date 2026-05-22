"use client";

import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { X, Loader2, Search } from "lucide-react";

export default function MealModal({ user, onClose, mealToEdit }: { user: any, onClose: () => void, mealToEdit?: any }) {
  const [loading, setLoading] = useState(false);
  
  const [description, setDescription] = useState(mealToEdit ? mealToEdit.description : "");
  const [calories, setCalories] = useState(mealToEdit ? mealToEdit.calories.toString() : "");
  const [mealType, setMealType] = useState(mealToEdit ? mealToEdit.type : "almoço");
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (mealToEdit && mealToEdit.dateRaw) {
      const d = new Date(mealToEdit.dateRaw);
      setDate(d.toISOString().split("T")[0]);
      setTime(d.toTimeString().split(" ")[0].substring(0, 5));
    } else {
      const hoje = new Date();
      setDate(hoje.toISOString().split("T")[0]);
      setTime(hoje.toTimeString().split(" ")[0].substring(0, 5));
    }
  }, [mealToEdit]);

  const handleSearchFood = async () => {
    if (!description.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);

    try {
      // Usando o Rewrite configurado no next.config.ts para evitar bloqueio de CORS
      const res = await fetch(`/api/food?search_terms=${encodeURIComponent(description)}&search_simple=1&action=process&json=1&page_size=6`);
      const data = await res.json();

      if (data.products && data.products.length > 0) {
        const validProducts = data.products.filter((p: any) => p.product_name && p.nutriments && p.nutriments["energy-kcal_100g"]);
        
        if (validProducts.length > 0) {
          setSearchResults(validProducts);
        } else {
          alert("Alimento encontrado, mas sem tabela calórica disponível.");
        }
      } else {
        alert("Nenhum alimento encontrado. Tente um termo mais simples.");
      }
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar alimento na base de dados.");
    } finally {
      setIsSearching(false);
    }
  };

  // Preenche a descrição e as calorias (baseadas em 100g/ml)
  const selectFood = (foodName: string, foodKcal: number) => {
    setDescription(foodName);
    setCalories(Math.round(foodKcal).toString());
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const combinedDate = new Date(`${date}T${time}:00`);

      if (mealToEdit) {
        const mealRef = doc(db, "users", user.uid, "meals", mealToEdit.id);
        await updateDoc(mealRef, {
          description,
          calories: Number(calories),
          type: mealType,
          dateRaw: combinedDate.getTime(),
        });
      } else {
        await addDoc(collection(db, "users", user.uid, "meals"), {
          description,
          calories: Number(calories),
          type: mealType,
          dateRaw: combinedDate.getTime(),
        });
      }
      onClose(); 
    } catch (error) {
      alert("Erro ao salvar.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{mealToEdit ? "Editar Refeição" : "Nova Refeição"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">O que você comeu?</label>
            <div className="flex gap-2">
              <input 
                required 
                type="text" 
                placeholder="Ex: Arroz, Pão, Maçã..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" 
                value={description} 
                onChange={e => {
                  setDescription(e.target.value);
                  if (searchResults.length > 0) setSearchResults([]); 
                }} 
              />
              <button
                type="button"
                onClick={handleSearchFood}
                disabled={isSearching || !description}
                className="bg-[#E8EDDF] text-[#2E4F3B] px-4 rounded-xl font-bold hover:bg-[#C2D6C6] transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                title="Buscar calorias na base de dados"
              >
                {isSearching ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-100 rounded-xl shadow-lg bg-white overflow-hidden max-h-48 overflow-y-auto z-50">
                <div className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase px-3 py-2 border-b border-gray-100">
                  Resultados (Aprox. por 100g ou 100ml)
                </div>
                {searchResults.map((product, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectFood(product.product_name, product.nutriments["energy-kcal_100g"])}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-[#F0F7F2] hover:text-[#2E4F3B] border-b border-gray-50 last:border-0 transition-colors flex justify-between items-center"
                  >
                    <span className="font-medium truncate pr-2">
                      {product.product_name} 
                      {product.brands ? <span className="text-xs text-gray-400 ml-1">({product.brands.split(',')[0]})</span> : ''}
                    </span>
                    <span className="font-bold text-[#2E4F3B] shrink-0">{Math.round(product.nutriments["energy-kcal_100g"])} kcal</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Calorias</label>
              <input 
                required 
                type="number" 
                min="0" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" 
                value={calories} 
                onChange={e => setCalories(e.target.value)} 
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tipo</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm" value={mealType} onChange={e => setMealType(e.target.value)}>
                <option value="café">Café da manhã</option>
                <option value="almoço">Almoço</option>
                <option value="lanche">Lanche</option>
                <option value="jantar">Jantar</option>
                <option value="ceia">Ceia</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Data</label>
              <input required type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="w-1/2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hora</label>
              <input required type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          <button disabled={loading} className="w-full bg-[#2E4F3B] text-white py-3.5 mt-4 rounded-xl font-bold flex justify-center items-center hover:bg-[#1f3628] transition-colors">
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Guardar Refeição"}
          </button>
        </form>
      </div>
    </div>
  );
}