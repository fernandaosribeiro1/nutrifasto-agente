"use client";

import { useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Leaf, Info, ArrowLeft, Loader2, CheckCircle2, Mail } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const handleRecuperar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSucesso(true);
    } catch (error: any) {
      console.error("Erro ao recuperar:", error);
      if (error.code === "auth/user-not-found") {
        setErro("Este e-mail não está cadastrado em nossa base.");
      } else {
        setErro("Ocorreu um erro. Verifique o e-mail digitado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans antialiased bg-white">
      
      {/* ================= LADO ESQUERDO (VERDE - IGUAL AO LOGIN) ================= */}
      <div className="w-full md:w-1/2 bg-[#2E4F3B] text-white p-8 md:p-16 flex flex-col justify-between relative">
        
        <Link 
          href="/login" 
          className="absolute top-8 left-8 md:static md:mb-8 flex items-center gap-2 text-[#C2D6C6] hover:text-white transition-colors w-fit z-20"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium tracking-tight">Voltar para o login</span>
        </Link>

        <div className="mt-16 md:mt-0">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-sm">
              <Leaf className="text-[#2E4F3B] w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NutriTrack</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tighter mb-6">
            Recupere seu <br /> acesso, <br />
            <span className="text-[#A7D1AB]">sem estresse.</span>
          </h1>
          <p className="text-[#C2D6C6] text-lg mb-8 max-w-md tracking-tight">
            Esqueceu sua senha? Não se preocupe. Vamos te ajudar a voltar para o seu acompanhamento em poucos passos.
          </p>
        </div>

        <div className="mt-16 flex items-start gap-3 text-xs text-[#C2D6C6] border-t border-[#3F634D] pt-6 leading-relaxed">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            Certifique-se de verificar sua pasta de spam caso não encontre o e-mail de recuperação em sua caixa de entrada principal.
          </p>
        </div>
      </div>

      {/* ================= LADO DIREITO (BRANCO) ================= */}
      <div className="w-full md:w-1/2 bg-[#FAFAFA] p-8 md:p-16 flex flex-col justify-center items-center">
        
        <div className="w-full max-w-md">
          
          {sucesso ? (
            /* ESTADO DE SUCESSO */
            <div className="text-center">
              <div className="bg-[#F0F7F2] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#C2D6C6]">
                <CheckCircle2 className="text-[#2E4F3B] w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">E-mail enviado!</h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                Enviamos um link de redefinição para <strong>{email}</strong>. 
                Siga as instruções no e-mail para criar uma nova senha.
              </p>
              <Link 
                href="/login"
                className="inline-block w-full bg-[#2E4F3B] text-white font-bold py-4 rounded-xl hover:bg-[#1f3628] transition-all shadow-md text-center"
              >
                Voltar para o Login
              </Link>
            </div>
          ) : (
            /* FORMULÁRIO DE RECUPERAÇÃO */
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Recuperar senha</h2>
              <p className="text-gray-500 text-sm mb-10 tracking-tight">Insira o e-mail associado à sua conta</p>

              <form className="space-y-6" onSubmit={handleRecuperar}>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-2 ml-1">E-mail de cadastro</label>
                  <div className="relative">
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@email.com" 
                      className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#2E4F3B] focus:ring-1 focus:ring-[#2E4F3B] transition-all bg-white text-gray-700 placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {erro && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-medium border border-red-100">
                    {erro}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#2E4F3B] text-white font-bold py-4 rounded-xl hover:bg-[#1f3628] transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-[#2E4F3B] transition-colors flex items-center justify-center gap-2">
                   <ArrowLeft size={14} /> Voltar para o login
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}