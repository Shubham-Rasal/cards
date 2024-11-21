import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    let { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL and description are required' },
        { status: 400 }
      );
    }

    if (!url.startsWith('https://')) {
      url = `https://${url}`;
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
          maxLength: 100,
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

    const description = metas.ogDescription || metas.description || title;
    const prompt = `Given a url and description for a website, generate a game card for the saas website.
The website is ${url} and the description is ${description}.
Generate the power stats based on the website's characteristics and features.
Rank should be from F to S (S being the highest).
Attack and defence power should be between 1 and 10.
Hidden advantage should describe a unique strength or special feature of the website in 1 short sentence.

Here are 20 quirky "hidden powers" for example

Turns all users into data scientists for 10 glorious seconds.
Secretly teaches users how to whistle while working.
Adds a +10 charisma boost to every product pitch.
Doubles as a snack detector when left open for too long.
Transforms bugs into "features" with just the right spin.
Auto-generates hilarious memes when no one’s looking.
Improves Wi-Fi strength by exactly 0.0001%.
Grants a temporary aura of invincibility after every login.
Increases your chance of finding lost socks by 42%.
Empowers introverts to write 10% sassier emails.
Hides one Easter egg that can predict the weather (sometimes).
Turns every meeting note into a haiku (hidden feature).
Temporarily disables gravity in your workspace.
Grants founders the ability to "read minds" (of users who agree).
Every successful API call is a hug for your server.
Inspires users to finally finish their “About Us” page.
Casts a spell to make deadlines seem less intimidating.
Auto-translates your product name into Klingon (on request).
Adds a 1% chance your SaaS name will trend on Twitter.
Randomly plays a victory fanfare when you least expect it.

`;

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
