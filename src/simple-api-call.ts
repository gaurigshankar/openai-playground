import OpenAI from "openai";
import { readConfig } from "./config";

async function main(messages: any) {
  const { OPEN_AI_API_KEY } = await readConfig();
  const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });
  const completion = await openai.chat.completions.create({
    messages,
    model: "gpt-4o",
  });

  console.log(completion.choices[0]);
}

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is the capital of Tamil Nadu, India?" },
];

main(messages);
