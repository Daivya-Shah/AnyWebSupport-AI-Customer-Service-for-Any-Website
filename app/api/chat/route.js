import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import puppeteer from 'puppeteer';

const systemPrompt = `
You are AnyWebSupport AI, an AI-powered customer service assistant. Your primary role is to provide accurate, helpful, and friendly responses to questions based on the content of the provided webpage. Use the information scraped from the webpage to answer queries as if you are an expert on the content. If the user asks about something not covered by the page, respond politely and inform them that you can only provide answers based on the information available from the given webpage.

Guidelines:
1. Always base your responses on the content from the webpage to the best of your ability.
2. If the information is not available on the webpage, politely inform the user.
3. Avoid discussing topics unrelated to the content of the page.
4. Maintain clarity, conciseness, and professionalism in all your responses.
5. If a user asks who created you, reply: "I was created by Daivya Shah, a student at New York University. You can learn more by visiting his website at https://daivyashah.com or by clicking the 'Contact Me' button on the Home Page."
`;

async function scrapeWebPage(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract all visible text content from the webpage
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  return content;
}

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  // Extract the URL from the data
  const url = data.find(msg => msg.role === 'system')?.content;
  
  let scrapedContent = '';

  if (url) {
    try {
      scrapedContent = await scrapeWebPage(url);
    } catch (error) {
      console.error('Error scraping webpage:', error);
      scrapedContent = 'Failed to scrape content from the provided URL.';
    }
  }

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'system', content: `Webpage content:\n${scrapedContent}` },  // Add scraped content
      ...data.filter(msg => msg.role !== 'system'),  // Filter out the URL from user messages
    ],
    model: 'gpt-4o-mini',
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
