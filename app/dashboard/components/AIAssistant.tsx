"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou sua Nutri IA 🍃 Como posso ajudar com dieta, emagrecimento, jejum ou treino hoje?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AUTO SCROLL
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // ==============================
      // CHAMADA PARA NOSSA ROTA INTERNA SEGURA
      // ==============================
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: currentInput,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao comunicar com a nossa API");
      }

      const data = await response.json();

      const aiResponse =
        data.choices?.[0]?.message?.content ||
        "Desculpe, não consegui processar a resposta agora.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "⚠️ Ocorreu um erro ao conectar com a IA. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          bg-[#2E4F3B]
          text-white
          p-4
          rounded-full
          shadow-2xl
          hover:bg-[#1f3628]
          hover:scale-105
          transition-all
          duration-300
          flex
          items-center
          justify-center
          ${
            isOpen
              ? "opacity-0 pointer-events-none scale-90"
              : "opacity-100 scale-100"
          }
        `}
      >
        <Sparkles className="absolute top-1 right-1 w-3 h-3 text-[#A7D1AB] animate-pulse" />
        <MessageCircle size={24} />
      </button>

      {/* CHAT */}
      <div
        className={`
          fixed bottom-6 right-6 z-50
          w-[350px] sm:w-[410px]
          h-[620px]
          bg-white
          border border-gray-200
          rounded-3xl
          shadow-2xl
          overflow-hidden
          flex flex-col
          transition-all duration-300
          origin-bottom-right
          ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-90 opacity-0 translate-y-10 pointer-events-none"
          }
        `}
      >
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#2E4F3B] to-[#3F634D] p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <Bot className="w-5 h-5 text-[#A7D1AB]" />
            </div>

            <div>
              <h2 className="font-bold text-sm tracking-tight">
                Nutri IA
              </h2>

              <p className="text-[11px] text-[#C2D6C6] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                IA Online
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10 p-2 rounded-lg transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* MENSAGENS */}
        <div className="flex-1 overflow-y-auto bg-[#F7F8F7] p-4 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex gap-2 max-w-[85%] ${
                  msg.role === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                {/* AVATAR */}
                <div
                  className={`
                    w-9 h-9 rounded-full
                    flex items-center justify-center
                    shrink-0
                    ${
                      msg.role === "user"
                        ? "bg-[#DDE8DF] text-[#2E4F3B]"
                        : "bg-[#2E4F3B] text-white"
                    }
                  `}
                >
                  {msg.role === "user" ? (
                    <User size={15} />
                  ) : (
                    <Bot size={15} />
                  )}
                </div>

                {/* BALÃO */}
                <div
                  className={`
                    px-4 py-3
                    rounded-2xl
                    text-sm
                    leading-relaxed
                    shadow-sm
                    whitespace-pre-wrap
                    ${
                      msg.role === "user"
                        ? "bg-[#2E4F3B] text-white rounded-tr-none"
                        : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* LOADING */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div className="w-9 h-9 rounded-full bg-[#2E4F3B] text-white flex items-center justify-center">
                  <Bot size={15} />
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2E4F3B]" />

                  <span className="text-sm text-gray-500">
                    Pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white border-t border-gray-100"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Pergunte algo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="
                w-full
                bg-[#F5F7F5]
                border border-gray-200
                rounded-2xl
                py-3
                pl-4
                pr-14
                text-sm
                outline-none
                focus:border-[#2E4F3B]
                transition-all
              "
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="
                absolute right-2
                w-10 h-10
                rounded-xl
                bg-[#2E4F3B]
                text-white
                flex items-center justify-center
                hover:bg-[#1f3628]
                transition-all
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}