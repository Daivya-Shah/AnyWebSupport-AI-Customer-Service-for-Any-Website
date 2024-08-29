import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { load } from 'cheerio'; // Import the 'load' function from the Cheerio library

// Initialize the OpenAI client with the API key from the environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the system prompt that guides the AI's responses
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
  // Fetch the raw HTML content of the webpage at the given URL
  const response = await fetch(url);
  // Convert the HTML response to text
  const html = await response.text();
  // Use Cheerio's 'load' function to parse the HTML content into a structured format (like a DOM tree)
  const $ = load(html);
  // Extract all visible text content from the 'body' of the webpage
  const content = $('body').text();
  return content; // Return the extracted text content
}

export async function POST(req) {
  // Parse the incoming request JSON data
  const data = await req.json();

  // Extract the URL from the data (usually provided as a 'system' role message)
  const url = data.find(msg => msg.role === 'system')?.content;

  let scrapedContent = '';

  // If a URL was provided, attempt to scrape the webpage content
  if (url) {
    try {
      scrapedContent = await scrapeWebPage(url);
    } catch (error) {
      console.error('Error scraping webpage:', error);
      scrapedContent = 'Failed to scrape content from the provided URL.'; // Handle any errors in scraping
    }
  }

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt }, // Add the initial system prompt
      { role: 'system', content: `Webpage content:\n${scrapedContent}` }, // Add the scraped webpage content
      ...data.filter(msg => msg.role !== 'system'), // Add the user's messages, filtering out the URL
    ],
    model: 'gpt-4o-mini',
    stream: true, // Enable streaming responses
  });

  // Create a readable stream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        // Iterate through the streamed chunks of data
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content); // Encode the text content
            controller.enqueue(text); // Add it to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  // Return the response stream
  return new NextResponse(stream);
}
