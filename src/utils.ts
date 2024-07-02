import OpenAI from "openai";
import { readConfig } from "./config";

export async function callOpenAIChat({
  messages,
  openAIOptions,
}: {
  messages: any[];
  openAIOptions?: any;
}) {
  try {
    const { OPEN_AI_API_KEY } = await readConfig();
    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
    const completion = await openai.chat.completions.create({
      messages,
      model: "gpt-4o",
      ...openAIOptions,
    });

    return completion.choices[0];
  } catch (error) {
    console.log(error);
    return "error"
  }
}

