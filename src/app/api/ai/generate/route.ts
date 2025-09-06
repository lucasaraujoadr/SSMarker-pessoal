import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt;
    const width: number = body?.width || 1024;
    const height: number = body?.height || 1024;
    const quality: 'standard' | 'hd' = body?.quality === 'hd' ? 'hd' : 'standard';
    const model: string = body?.model || 'dall-e-3';

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Parâmetro prompt é obrigatório.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key não configurada no servidor.' }, { status: 500 });
    }

    // DALL·E 3 aceita apenas tamanhos: 1024x1024, 1792x1024, 1024x1792
    const aspect = width / height;
    let size = '1024x1024';
    if (aspect > 1.3) size = '1792x1024';
    else if (aspect < 0.77) size = '1024x1792';

    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size,
        quality,
        response_format: 'url',
      }),
    });

    if (!openaiRes.ok) {
      const text = await openaiRes.text().catch(() => '');
      let message = 'Erro na OpenAI';
      try {
        const parsed = JSON.parse(text);
        message = parsed?.error?.message || message;
      } catch {}
      console.error('OpenAI error response:', text);
      return NextResponse.json({ error: message }, { status: openaiRes.status });
    }

    const data = await openaiRes.json();
    const url: string | undefined = data?.data?.[0]?.url;

    if (!url) {
      return NextResponse.json({ error: 'Resposta inválida da OpenAI' }, { status: 502 });
    }

    return NextResponse.json({ success: true, imageUrl: url, metadata: { model, provider: 'OpenAI' } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Erro interno' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}


