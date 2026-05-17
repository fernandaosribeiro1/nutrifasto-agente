"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Leaf, Info, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function LoginPage() {
  // Estados para capturar o que o usuário digita
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Função disparada ao clicar em "Entrar na conta"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tenta fazer o login no Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Se der certo, redireciona para o Dashboard
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Erro no login:", error);
      
      // Tradução de erros comuns do Firebase para o usuário
      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        alert("E-mail ou senha incorretos. Tente novamente.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Muitas tentativas falhas. Tente novamente mais tarde.");
      } else {
        alert("Erro ao fazer login: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans antialiased bg-white">
      
      {/* ================= LADO ESQUERDO (VERDE) ================= */}
      <div className="w-full md:w-1/2 bg-[#2E4F3B] text-white p-8 md:p-16 flex flex-col justify-between relative">
        
        {/* Botão Voltar */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 md:static md:mb-8 flex items-center gap-2 text-[#C2D6C6] hover:text-white transition-colors w-fit z-20"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium tracking-tight">Voltar para o início</span>
        </Link>

        <div className="mt-16 md:mt-0">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-sm">
              <Leaf className="text-[#2E4F3B] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NutriTrack</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter mb-6">
            Conheça seus <br /> hábitos, <br />
            <span className="text-[#A7D1AB]">com calma.</span>
          </h1>
          <p className="text-[#C2D6C6] text-lg mb-8 max-w-md tracking-tight">
            Uma ferramenta para acompanhar sua alimentação de forma consciente, sem pressão.
          </p>

          <ul className="space-y-4 text-white font-medium">
            <li className="flex items-center gap-3 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-[#A7D1AB]"></div>
              Registro de refeições e calorias
            </li>
            <li className="flex items-center gap-3 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-[#A7D1AB]"></div>
              Acompanhamento de jejum intermitente
            </li>
            <li className="flex items-center gap-3 tracking-tight">
              <div className="w-2 h-2 rounded-full bg-[#A7D1AB]"></div>
              Progresso semanal visual
            </li>
          </ul>
        </div>

        {/* Aviso Ético */}
        <div className="mt-16 flex items-start gap-3 text-xs text-[#C2D6C6] border-t border-[#3F634D] pt-6 leading-relaxed">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Este aplicativo não substitui orientação médica ou nutricional profissional. Consulte um profissional de saúde antes de iniciar qualquer mudança alimentar.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO (BRANCO) ================= */}
      <div className="w-full md:w-1/2 bg-[#FAFAFA] p-8 md:p-16 flex flex-col justify-center items-center">
        
        <div className="w-full max-w-md">
          {/* Switch de Navegação */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-10 shadow-sm">
            <div className="w-1/2 py-2.5 bg-white shadow-sm rounded-lg text-sm font-bold border border-gray-100 text-[#2E4F3B] text-center">
              Entrar
            </div>
            <Link href="/register" className="w-1/2 py-2.5 text-center text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors">
              Criar conta
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Bem-vindo de volta</h2>
          <p className="text-gray-500 text-sm mb-8 tracking-tight">Continue de onde parou no seu acompanhamento</p>

          <div className="bg-[#F0F7F2] border border-[#C2D6C6] text-[#2E4F3B] p-4 rounded-xl flex items-center gap-3 mb-8 text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <p className="font-medium">Seus dados são armazenados com segurança e nunca são compartilhados.</p>
          </div>

          {/* Formulário de Login */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">E-mail</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-white text-gray-700 placeholder:text-gray-300"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Senha</label>
                <a href="#" className="text-[11px] text-gray-400 hover:text-[#2E4F3B] hover:underline transition-colors font-semibold">
                  Esqueceu a senha?
                </a>
              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-white text-gray-700 placeholder:text-gray-300"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E4F3B] text-white font-bold py-4 rounded-xl hover:bg-[#1f3628] transition-all shadow-md mt-6 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Entrando...</span>
                </>
              ) : (
                "Entrar na conta"
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}