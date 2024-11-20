import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { url, description } = await request.json();

    if (!url || !description) {
      return NextResponse.json(
        { error: 'URL and description are required' },
        { status: 400 }
      );
    }

    const pageResponse = await fetch(url);
    if (!pageResponse.ok) {
      throw new Error(`Failed to fetch webpage: ${pageResponse.statusText}`);
    }

    const text = await pageResponse.text();
    const $ = cheerio.load(text);
    const metas: Record<string, string> = {};
    $('meta').each((_: any, tag: any) => {
      const name = $(tag).attr('name');
      const property = $(tag).attr('property');
      const content = $(tag).attr('content');
      if (name) {
        metas[name] = content || '';
      }
      if (property) {
        metas[property] = content || '';
      }
    });

    const title = $('title').text() || '';

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not defined');
    }

    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        rank: {
          type: SchemaType.STRING,
          description: "Rank from F to S, where S is the highest",
          nullable: false,
        },
        attackPower: {
          type: SchemaType.NUMBER,
          description: "Attack power of the website (1-10)",
          nullable: false,
        },
        defencePower: {
          type: SchemaType.NUMBER,
          description: "Defence power of the website (1-10)",
          nullable: false,
        },
        hiddenAdvantage: {
          type: SchemaType.STRING,
          description: "Hidden advantage or special feature of the website",
          nullable: false,
        }
      },
      required: ["rank", "attackPower", "defencePower", "hiddenAdvantage"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const prompt = `Given a title and description for a website, generate a game card for the saas website.
The website is ${url} and the description is ${description}.
Generate the power stats based on the website's characteristics and features.
Rank should be from F to S (S being the highest).
Attack and defence power should be between 1 and 10.
Hidden advantage should describe a unique strength or special feature of the website.`;

    const result = await model.generateContent(prompt);
    const response =  JSON.parse(result.response.text());

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating power:', error);
    return NextResponse.json(
      { error: 'Failed to generate power' },
      { status: 500 }
    );
  }
}
