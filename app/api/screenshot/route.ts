import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export const maxDuration = 30;

chromium.setHeadlessMode = true

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH

    const browser = await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath("https://utfs.io/f/9lg7ZYvhJ4T6BX7XpCWm7GVrihD9LWYgqySNKbEHMzpnteoj"),
      headless: chromium.headless,
    }); 

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    const screenshot = await page.screenshot({ encoding: 'base64' });

    await browser.close();

    return NextResponse.json({ screenshot: `data:image/png;base64,${screenshot}` });
  } catch (error) {
    console.error('Error taking screenshot:', error);
    return NextResponse.json({ error: 'Failed to take screenshot' }, { status: 500 });
  }
}