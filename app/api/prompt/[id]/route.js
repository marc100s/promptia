import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import { auth } from "@auth";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const { id } = await params;

    const prompt = await Prompt.findById(id).populate("creator");
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { prompt, tag } = await request.json();

  try {
    await connectToDB();
    const { id } = await params;

    const existingPrompt = await Prompt.findById(id);
    if (!existingPrompt) return new Response("Prompt not found", { status: 404 });

    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    return new Response("Successfully updated the prompt", { status: 200 });
  } catch (error) {
    return new Response("Error updating prompt", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    await connectToDB();
    const { id } = await params;

    await Prompt.findByIdAndDelete(id);

    return new Response("Prompt deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prompt", { status: 500 });
  }
};
