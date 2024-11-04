import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    // 1. Request 로깅
    console.log('Incoming request at:', new Date().toISOString());
    
    // 2. Request Body 파싱 로깅
    const body = await req.json();
    console.log('Request body:', body);
    
    const { question } = body;
    if (!question) {
      console.error('Validation Error: Question is missing');
      return NextResponse.json(
        { error: 'Question is required' }, 
        { status: 400 }
      );
    }

    // 3. OpenAI API 호출 전 로깅
    console.log('Calling OpenAI API with question:', question);
    
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `${question}의 내용이 포함된 책 하나를 추천해줘. 줄거리, 작가 이름, 장르, 출판일은 1990년 이후의 한국 출판 책으로 부탁해.` },
        ],
      });

      // 4. 성공적인 응답 로깅
      console.log('OpenAI API Response:', {
        status: 'success',
        content: completion.choices[0].message.content,
        usage: completion.usage,
        model: completion.model
      });

      return NextResponse.json({ result: completion.choices[0].message.content });
      
    } catch (apiError: any) {
      // 5. OpenAI API 특정 에러 로깅
      console.error('OpenAI API Error:', {
        error: apiError,
        message: apiError.message,
        type: apiError.type,
        statusCode: apiError.statusCode,
        stack: apiError.stack
      });

      if (apiError.response) {
        console.error('API Response Error:', {
          status: apiError.response.status,
          headers: apiError.response.headers,
          data: apiError.response.data
        });
      }

      return NextResponse.json(
        { error: `OpenAI API Error: ${apiError.message}` },
        { status: apiError.statusCode || 500 }
      );
    }

  } catch (error: any) {
    // 6. 일반적인 에러 로깅
    console.error('기본 Error:', {
      error,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // 7. 환경 변수 체크 로깅 (API 키는 일부만 표시)
    console.log('환경변수 Check:', {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      apiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 3) + '...',
      nodeEnv: process.env.NODE_ENV
    });

    return NextResponse.json(
      { error: '서버 에러가 발생했습니다.' },
      { status: 500 }
    );
  }
}