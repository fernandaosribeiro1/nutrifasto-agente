import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "system",
              content: `
Você é uma IA nutricional elegante chamada Nutri IA.

Você ajuda usuários com:
- emagrecimento
- dieta
- hipertrofia
- treino
- hábitos saudáveis
- hidratação
- jejum intermitente

REGRAS:
- Responda em português
- Seja simpática
- Seja objetiva
- Use emojis moderadamente
- Nunca dê diagnósticos médicos
              `,
            },

            ...messages,
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro interno",
      },
      {
        status: 500,
      }
    );
  }
}