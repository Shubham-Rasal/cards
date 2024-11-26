import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const hiddenPowers = [
  "Turns all users into data scientists for 10 glorious seconds",
  "Secretly teaches users how to whistle while working",
  "Adds a +10 charisma boost to every product pitch",
  "Doubles as a snack detector when left open for too long",
  "Transforms bugs into \"features\" with just the right spin",
  "Auto-generates hilarious memes when no one's looking",
  "Improves Wi-Fi strength by exactly 0.0001%",
  "Grants a temporary aura of invincibility after every login",
  "Increases your chance of finding lost socks by 42%",
  "Empowers introverts to write 10% sassier emails",
  "Hides one Easter egg that can predict the weather (sometimes)",
  "Turns every meeting note into a haiku (hidden feature)",
  "Temporarily disables gravity in your workspace",
  "Grants founders the ability to \"read minds\" (of users who agree)",
  "Every successful API call is a hug for your server",
  "Inspires users to finally finish their \"About Us\" page",
  "Casts a spell to make deadlines seem less intimidating",
  "Auto-translates your product name into Klingon (on request)",
  "Adds a 1% chance your SaaS name will trend on Twitter",
  "Randomly plays a victory fanfare when you least expect it"
];

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

    const description = metas.ogDescription || metas.description || title;

    const randomIndex = Math.floor(Math.random() * hiddenPowers.length);
    const hiddenPower = hiddenPowers[randomIndex];
    const rank = ["S", "A", "B"]
    return NextResponse.json({
      rank: rank[Math.floor(Math.random() * rank.length)],
      attackPower: Math.floor(Math.random() * 10) + 1,
      defencePower: Math.floor(Math.random() * 10) + 1,
      hiddenAdvantage: hiddenPower
    });

  } catch (error) {
    console.error('Error generating power:', error);
    return NextResponse.json(
      { error: 'Failed to generate power' },
      { status: 500 }
    );
  }
}
