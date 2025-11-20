import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // Analisar imagem com OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analise esta imagem de um frigorífico ou despensa e identifique TODOS os ingredientes e alimentos visíveis. Liste apenas os nomes dos ingredientes em português, separados por vírgula. Seja específico e detalhado. Se não conseguir identificar claramente, liste os ingredientes mais prováveis baseado no que consegue ver.",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || "";
    
    // Processar a resposta para extrair lista de ingredientes
    const ingredients = content
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return NextResponse.json({
      ingredients,
      rawResponse: content,
    });
  } catch (error) {
    console.error("Erro ao analisar imagem:", error);
    return NextResponse.json(
      { error: "Erro ao processar imagem" },
      { status: 500 }
    );
  }
}
