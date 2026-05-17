"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Leaf, Info, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

export default function RegisterPage() {
  // Estados para capturar os dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // Função disparada ao clicar em "Finalizar Cadastro"
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Cria a conta no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Atualiza o perfil do usuário recém-criado com o nome digitado
      await updateProfile(userCredential.user, { 
        displayName: name 
      });

      alert("Conta criada com sucesso!");
      // AQUI ESTÁ A MUDANÇA: Redireciona direto para o Dashboard!
      router.push("/onboarding"); 
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      
      // Tradução simples de erros comuns para o usuário
      if (error.code === "auth/email-already-in-use") {
        alert("Este e-mail já está em uso.");
      } else if (error.code === "auth/weak-password") {
        alert("A senha deve ter pelo menos 6 caracteres.");
      } else {
        alert("Erro ao criar conta: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans antialiased bg-white">
      
      {/* ================= LADO ESQUERDO (VERDE) ================= */}
      <div className="w-full md:w-1/2 bg-[#2E4F3B] text-white p-8 md:p-16 flex flex-col justify-between relative">
        
        {/* Botão Voltar para Home */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 md:static md:mb-8 flex items-center gap-2 text-[#C2D6C6] hover:text-white transition-colors w-fit z-20"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium tracking-tight">Voltar para o início</span>
        </Link>

        <div className="mt-16 md:mt-0">
          {/* Logo NutriTrack */}
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-sm">
              <Leaf className="text-[#2E4F3B] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NutriTrack</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter mb-6">
            Comece sua <br /> jornada, <br />
            <span className="text-[#A7D1AB]">no seu ritmo.</span>
          </h1>
          <p className="text-[#C2D6C6] text-lg mb-8 max-w-md tracking-tight">
            Junte-se a nós para transformar sua relação com a comida de forma leve e consciente.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#3F634D] p-2 rounded-lg">
                <ShieldCheck className="text-[#A7D1AB] w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white tracking-tight">Privacidade Total</h3>
                <p className="text-sm text-[#C2D6C6]">Seus dados são apenas seus e ficam protegidos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aviso Ético Requerido */}
        <div className="mt-16 flex items-start gap-3 text-xs text-[#C2D6C6] border-t border-[#3F634D] pt-6 leading-relaxed">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Aplicação acadêmica. Este sistema não substitui orientação médica ou nutricional profissional. 
            Consulte um especialista antes de mudanças alimentares.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO (BRANCO/FORMULÁRIO) ================= */}
      <div className="w-full md:w-1/2 bg-[#FAFAFA] p-8 md:p-16 flex flex-col justify-center items-center">
        
        <div className="w-full max-w-md">
          {/* Switch de Navegação entre Login e Registro */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-10 shadow-sm">
            <Link 
              href="/login" 
              className="w-1/2 py-2.5 text-center text-gray-500 text-sm font-medium hover:text-gray-800 transition-colors"
            >
              Entrar
            </Link>
            <div className="w-1/2 py-2.5 bg-white shadow-sm rounded-lg text-sm font-bold border border-gray-100 text-[#2E4F3B] text-center">
              Criar conta
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Crie sua conta</h2>
          <p className="text-gray-500 text-sm mb-8 tracking-tight">Preencha os dados abaixo para começar seu acompanhamento.</p>

          {/* Formulário de Registro */}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">Nome Completo</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como quer ser chamado?" 
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-white text-gray-700 placeholder:text-gray-300"
              />
            </div>

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
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">Senha</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres" 
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-white text-gray-700 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 py-2 px-1">
              <input 
                required
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 rounded border-gray-300 text-[#2E4F3B] focus:ring-[#2E4F3B]" 
              />
              <label htmlFor="terms" className="text-xs text-gray-500 font-medium">
                Aceito os termos de uso e política de privacidade.
              </label>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E4F3B] text-white font-bold py-4 rounded-xl hover:bg-[#1f3628] transition-all shadow-md mt-4 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  <span>Criando conta...</span>
                </>
              ) : (
                "Finalizar Cadastro"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8 font-medium">
            Já possui uma conta? <Link href="/login" className="text-[#2E4F3B] font-bold hover:underline transition-all">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}