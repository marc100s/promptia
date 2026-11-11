import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";
import { auth } from "@/auth";
import { validatePrompt } from "@/utils/validation";
import { rateLimit } from "@/middleware/rateLimit";
import "@/models/user";

export const dynamic = 'force-dynamic';

export const GET = async (request, { params }) => {
  try {
    const { limited, retryAfter } = rateLimit(request, { maxRequests: 50 });
    
    if (limited) {
      return new Response(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Retry-After': retryAfter } }
      );
    }

    await connectToDB();
    const { id } = await params;

    const prompt = await Prompt.findById(id).populate("creator");
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    console.error('[GET /api/prompt/[id]]', error.message);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PATCH = async (request, { params }) => {
  try {
    const { limited, retryAfter } = rateLimit(request, { maxRequests: 10 });
    
    if (limited) {
      return new Response(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Retry-After': retryAfter } }
      );
    }

    const session = await auth();
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, tag } = await request.json();
    const { isValid, errors } = validatePrompt(prompt, tag);

    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDB();
    const { id } = await params;

    const existingPrompt = await Prompt.findById(id);
    if (!existingPrompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    existingPrompt.prompt = prompt.trim();
    existingPrompt.tag = tag.trim().toLowerCase();
    await existingPrompt.save();

    return new Response(
      JSON.stringify({ message: 'Prompt updated successfully', prompt: existingPrompt }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[PATCH /api/prompt/[id]]', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to update prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const { limited, retryAfter } = rateLimit(request, { maxRequests: 10 });
    
    if (limited) {
      return new Response(
        JSON.stringify({ error: 'Too many requests' }),
        { status: 429, headers: { 'Retry-After': retryAfter } }
      );
    }

    const session = await auth();
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectToDB();
    const { id } = await params;

    const prompt = await Prompt.findByIdAndDelete(id);
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Prompt deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[DELETE /api/prompt/[id]]', error.message);
    return new Response(
      JSON.stringify({ error: 'Failed to delete prompt' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
