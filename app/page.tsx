"use client";

import Link from "next/link";
import { Leaf, CalendarDays, ClipboardList, LineChart, Timer, ShieldCheck, ArrowRight, Star, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  
  // Função para fazer o scroll suave e descontar a altura do header fixo
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    
    if (target) {
      const headerOffset = 85; // Altura aproximada do header
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#2E4F3B] relative flex flex-col font-sans antialiased text-white">
      
      {/* HEADER FIXO E COM EFEITO BLUR */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 md:px-16 py-4 flex justify-between items-center bg-[#2E4F3B]/90 backdrop-blur-md shadow-md border-b border-white/5 transition-all">
        
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <div className="bg-[#A7D1AB] p-2 rounded-xl shadow-sm flex items-center justify-center">
            <Leaf className="text-[#2E4F3B] w-6 h-6" />
          </div>
          NutriTrack
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#C2D6C6]">
          <a href="#quem-somos" onClick={(e) => handleScroll(e, "quem-somos")} className="hover:text-white transition-colors cursor-pointer">Quem somos</a>
          <a href="#como-funciona" onClick={(e) => handleScroll(e, "como-funciona")} className="hover:text-white transition-colors cursor-pointer">Como funciona</a>
          <a href="#recursos" onClick={(e) => handleScroll(e, "recursos")} className="hover:text-white transition-colors cursor-pointer">Recursos</a>
          <a href="#depoimentos" onClick={(e) => handleScroll(e, "depoimentos")} className="hover:text-white transition-colors cursor-pointer">Depoimentos</a>
          <a href="#faq" onClick={(e) => handleScroll(e, "faq")} className="hover:text-white transition-colors cursor-pointer">FAQ</a>
          <Link
            href="/login"
            className="ml-4 bg-white text-[#2E4F3B] px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-sm"
          >
            Fazer Login
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <main className="relative z-10 flex-1">
        {/* Adicionado padding-top (pt-32) para o conteúdo não ficar atrás do header fixo */}
        <section className="px-6 md:px-16 pt-32 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 bg-[#496E58] text-[#A7D1AB] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-5">
                Alimentação inteligente e acompanhamento diário
              </span>

              <p className="text-[#C2D6C6] text-base md:text-lg max-w-xl mb-6 leading-relaxed">
                Organize suas refeições, acompanhe sua meta calórica, controle jejuns e visualize sua evolução de forma simples, moderna e prática.
              </p>

              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tighter mb-6">
                Seu cuidado com a alimentação, <br />
                em um só lugar.
              </h1>

              <p className="text-[#E8EDDF] text-base md:text-lg max-w-xl mb-8 leading-relaxed">
                O NutriTrack ajuda você a registrar refeições, monitorar calorias, acompanhar jejuns e entender melhor sua rotina alimentar com uma interface clara e intuitiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#2E4F3B] px-6 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Começar agora <ArrowRight size={18} />
                </Link>

                <a
                  href="#como-funciona"
                  onClick={(e) => handleScroll(e, "como-funciona")}
                  className="inline-flex items-center justify-center gap-2 border border-[#C2D6C6] text-white px-6 py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Ver como funciona
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-4 text-[#2E4F3B]">
                  <p className="text-xs font-bold uppercase text-[#7A8F7F] mb-1">Meta diária</p>
                  <p className="text-2xl font-black">2.000 kcal</p>
                  <p className="text-sm text-gray-500 mt-1">Acompanhamento de consumo</p>
                </div>

                <div className="bg-[#E8EDDF] rounded-2xl p-4 text-[#2E4F3B]">
                  <p className="text-xs font-bold uppercase text-[#7A8F7F] mb-1">Jejum ativo</p>
                  <p className="text-2xl font-black">08h 24m</p>
                  <p className="text-sm text-gray-500 mt-1">Controle do tempo em jejum</p>
                </div>

                <div className="bg-[#3F634D] rounded-2xl p-4 col-span-2 text-white">
                  <p className="text-xs font-bold uppercase text-[#C2D6C6] mb-1">Resumo semanal</p>
                  <div className="h-24 flex items-end gap-2 mt-3">
                    <div className="w-1/6 h-10 bg-[#A7D1AB] rounded-t-md"></div>
                    <div className="w-1/6 h-16 bg-[#C2D6C6] rounded-t-md"></div>
                    <div className="w-1/6 h-8 bg-[#A7D1AB] rounded-t-md"></div>
                    <div className="w-1/6 h-20 bg-white rounded-t-md"></div>
                    <div className="w-1/6 h-12 bg-[#A7D1AB] rounded-t-md"></div>
                    <div className="w-1/6 h-24 bg-[#C2D6C6] rounded-t-md"></div>
                  </div>
                  <p className="text-xs text-[#C2D6C6] mt-3">Visualização da evolução ao longo da semana.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUEM SOMOS */}
        <section id="quem-somos" className="px-6 md:px-16 py-20 bg-[#F5F7F5] text-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#2E4F3B] text-xs font-bold uppercase tracking-widest">Quem somos</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-4">
                Uma plataforma pensada para simplificar sua rotina.
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O NutriTrack foi desenvolvido para pessoas que desejam acompanhar a alimentação com mais organização, clareza e praticidade.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Com ele, você registra refeições, acompanha calorias, define metas e monitora jejuns sem complicação, tudo em uma experiência visual limpa e agradável.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <CheckCircle2 className="text-[#2E4F3B] mb-3" />
                <h3 className="font-bold mb-2">Organização diária</h3>
                <p className="text-sm text-gray-600">Registre tudo de forma rápida e acompanhe sua rotina alimentar.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <ShieldCheck className="text-[#2E4F3B] mb-3" />
                <h3 className="font-bold mb-2">Controle e clareza</h3>
                <p className="text-sm text-gray-600">Veja metas, progresso e histórico em um só painel.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <LineChart className="text-[#2E4F3B] mb-3" />
                <h3 className="font-bold mb-2">Evolução visual</h3>
                <p className="text-sm text-gray-600">Entenda sua semana com gráficos simples e objetivos.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <Timer className="text-[#2E4F3B] mb-3" />
                <h3 className="font-bold mb-2">Jejum monitorado</h3>
                <p className="text-sm text-gray-600">Acompanhe o tempo de jejum com contagem em tempo real.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="px-6 md:px-16 py-20 bg-[#2E4F3B]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-[#A7D1AB] text-xs font-bold uppercase tracking-widest">Como funciona</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-4">
                Três passos para acompanhar sua alimentação com mais facilidade.
              </h2>
              <p className="text-[#C2D6C6] leading-relaxed">
                O sistema foi desenhado para ser prático, direto e útil no seu dia a dia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <CalendarDays className="text-[#A7D1AB] mb-4" />
                <h3 className="text-xl font-bold mb-2">1. Registre suas refeições</h3>
                <p className="text-[#C2D6C6] text-sm leading-relaxed">
                  Adicione café da manhã, almoço, jantar e lanches com descrição, horário e calorias.
                </p>
              </div>

              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <ClipboardList className="text-[#A7D1AB] mb-4" />
                <h3 className="text-xl font-bold mb-2">2. Acompanhe sua meta</h3>
                <p className="text-[#C2D6C6] text-sm leading-relaxed">
                  Veja quanto já consumiu no dia e compare com sua meta calórica diária.
                </p>
              </div>

              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <LineChart className="text-[#A7D1AB] mb-4" />
                <h3 className="text-xl font-bold mb-2">3. Analise sua evolução</h3>
                <p className="text-[#C2D6C6] text-sm leading-relaxed">
                  Use o gráfico semanal e o histórico para entender sua rotina e fazer ajustes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section id="recursos" className="px-6 md:px-16 py-20 bg-[#F5F7F5] text-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-[#2E4F3B] text-xs font-bold uppercase tracking-widest">Recursos</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-4">
                Funcionalidades feitas para o seu acompanhamento diário.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Meta calórica</h3>
                <p className="text-sm text-gray-600">Defina e altere sua meta diária de acordo com sua rotina.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Controle de refeições</h3>
                <p className="text-sm text-gray-600">Cadastre refeições com calorias, tipo e horário de consumo.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Jejum intermitente</h3>
                <p className="text-sm text-gray-600">Inicie, acompanhe e finalize jejuns com timer em tempo real.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-2">Histórico semanal</h3>
                <p className="text-sm text-gray-600">Veja refeições e jejuns por dia para acompanhar sua evolução.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section id="depoimentos" className="px-6 md:px-16 py-20 bg-[#2E4F3B]">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-[#A7D1AB] text-xs font-bold uppercase tracking-widest">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-4">
                O que a experiência com o app transmite.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <div className="flex gap-1 text-[#A7D1AB] mb-4">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-[#E8EDDF] text-sm leading-relaxed mb-4">
                  “A interface é limpa e muito fácil de usar. Fica simples acompanhar as refeições e a meta do dia.”
                </p>
                <p className="text-[#C2D6C6] text-xs font-semibold">Usuário NutriTrack</p>
              </div>

              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <div className="flex gap-1 text-[#A7D1AB] mb-4">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-[#E8EDDF] text-sm leading-relaxed mb-4">
                  “Gostei muito do controle de jejum e do histórico. Deixa tudo centralizado.”
                </p>
                <p className="text-[#C2D6C6] text-xs font-semibold">Usuário NutriTrack</p>
              </div>

              <div className="bg-[#3F634D] rounded-3xl p-6 border border-white/10">
                <div className="flex gap-1 text-[#A7D1AB] mb-4">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-[#E8EDDF] text-sm leading-relaxed mb-4">
                  “Os gráficos ajudam a entender melhor minha rotina alimentar ao longo da semana.”
                </p>
                <p className="text-[#C2D6C6] text-xs font-semibold">Usuário NutriTrack</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="px-6 md:px-16 py-20 bg-[#F5F7F5] text-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-10">
              <span className="text-[#2E4F3B] text-xs font-bold uppercase tracking-widest">Perguntas frequentes</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-3 mb-4">
                Dúvidas comuns sobre o NutriTrack.
              </h2>
            </div>

            <div className="space-y-4 max-w-3xl">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold mb-2">O que posso acompanhar no app?</h3>
                <p className="text-sm text-gray-600">Você pode registrar refeições, calorias, meta diária, jejum e histórico semanal.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold mb-2">Posso alterar minha meta calórica?</h3>
                <p className="text-sm text-gray-600">Sim. A meta diária pode ser ajustada diretamente no painel do usuário.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-bold mb-2">O sistema mostra meu progresso?</h3>
                <p className="text-sm text-gray-600">Sim. Há indicadores visuais, barras de progresso e gráficos semanais.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="contato" className="px-6 md:px-16 py-20 bg-[#2E4F3B]">
          <div className="max-w-6xl mx-auto bg-[#3F634D] rounded-3xl p-8 md:p-12 border border-white/10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Pronta para acompanhar sua rotina com mais clareza?
            </h2>
            <p className="text-[#C2D6C6] max-w-2xl mx-auto mb-8 leading-relaxed">
              Entre no NutriTrack, registre suas refeições e tenha uma visão completa da sua evolução.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#2E4F3B] px-7 py-3.5 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-sm"
            >
              Fazer Login <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1F3628] text-[#C2D6C6] px-6 md:px-16 py-8 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 NutriTrack. Todos os direitos reservados.
          </p>

          <p className="text-sm">
            Feito para acompanhar alimentação, jejum e evolução diária.
          </p>
        </div>
      </footer>
    </div>
  );
}