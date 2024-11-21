import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const encodedUrl = encodeURIComponent(url);
    const apiKey = process.env.SCREENSHOTONE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const apiUrl = `https://api.screenshotone.com/take?access_key=${apiKey}&url=${encodedUrl}&format=jpg&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60&response_type=by_format&image_quality=80`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Screenshot API error: ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    return NextResponse.json({ 
      screenshot: `data:image/jpeg;base64,${base64Image}` 
    });

  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json({ 
      error: 'Failed to take screenshot',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
