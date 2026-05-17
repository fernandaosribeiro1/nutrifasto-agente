"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Activity, ArrowRight, Info, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Estados do formulário
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("manter");
  const [loading, setLoading] = useState(false);

  // Verifica se a pessoa está logada
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/register");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Cálculo fictício e acadêmico para definir uma meta diária baseada no objetivo
      let dailyCalories = 2000; // Base padrão
      if (goal === "perder") dailyCalories = 1700;
      if (goal === "ganhar") dailyCalories = 2500;

      // Cria um documento exclusivo para o usuário no banco de dados com a meta e os dados dele
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        weight: Number(weight),
        height: Number(height),
        goal: goal,
        dailyGoal: dailyCalories, // Essa é a Meta Calórica (Requisito 3 do professor)
        onboardingCompleted: true,
      });

      alert("Perfil configurado com sucesso! Vamos para o seu painel.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar suas informações.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F5F7F5] flex flex-col font-sans antialiased text-gray-800">
      
      {/* HEADER SIMPLES */}
      <header className="w-full px-6 py-6 flex justify-center items-center bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="text-[#A7D1AB] w-6 h-6" />
          <span className="text-xl font-bold tracking-tight text-[#2E4F3B]">NutriTrack</span>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Bem-vindo, {user.displayName?.split(" ")[0]}!</h1>
          <p className="text-gray-500 mb-8 tracking-tight">Para personalizar sua experiência, precisamos de alguns dados básicos.</p>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">Peso (kg)</label>
                <input 
                  required type="number" min="30" value={weight} onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ex: 70" 
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-[#FAFAFA]"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">Altura (cm)</label>
                <input 
                  required type="number" min="100" value={height} onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ex: 175" 
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-[#FAFAFA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">Objetivo Principal</label>
              <select 
                value={goal} onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-[#FAFAFA] text-gray-700"
              >
                <option value="perder">Perder peso de forma leve</option>
                <option value="manter">Manter o peso atual</option>
                <option value="ganhar">Ganho de massa muscular</option>
              </select>
            </div>

            {/* Aviso Ético do Professor dentro do fluxo */}
            <div className="bg-[#F0F7F2] border border-[#C2D6C6] text-[#2E4F3B] p-4 rounded-xl flex items-start gap-3 mt-4 text-xs leading-relaxed">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>A meta calórica gerada é apenas uma estimativa acadêmica baseada no seu objetivo. Consulte um nutricionista para um plano adequado à sua realidade.</p>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-[#2E4F3B] text-white font-bold py-4 rounded-xl hover:bg-[#1f3628] transition-all shadow-md mt-8 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>Continuar para o Painel <ArrowRight size={18} /></>
              )}
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}