import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";
import "@/models/user";
import { rateLimit } from "@/middleware/rateLimit";

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
  try {
    const { limited, retryAfter } = rateLimit(request, { maxRequests: 50 });
    
    if (limited) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter,
          },
        }
      );
    }

    await connectToDB();
    const prompts = await Prompt.find({}).populate('creator');

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error('[GET /api/prompt]', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch prompts' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};