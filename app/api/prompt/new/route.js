import { connectToDB } from "@/utils/database";
import Prompt from "@/models/prompt";
import { auth } from "@/auth";
import { validatePrompt } from "@/utils/validation";
import { rateLimit } from "@/middleware/rateLimit";

export const POST = async (req) => {
  try {
    const { limited, remaining, retryAfter } = rateLimit(req, { maxRequests: 10 });
    
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

    const session = await auth();
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { isValid, errors } = validatePrompt(body.prompt, body.tag);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDB();
    const newPrompt = new Prompt({
      creator: body.userId,
      prompt: body.prompt.trim(),
      tag: body.tag.trim().toLowerCase(),
    });

    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), { status: 201 });
  } catch (error) {
    console.error('[POST /api/prompt/new]', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to create prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
