import { callOpenAIChat } from "./utils";

const messages = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "What is the capital of Tamil Nadu, India?" },
];
async function main(messages: any) {
    const input = {
        messages,
        // openAIOptions: {
        //     response_format: { type: "json_object" },
        // }
    }
  const reponse = await callOpenAIChat(input);
  console.log(reponse);
}

async function openAIJSONResponse() {
    const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the capital of Tamil Nadu, India ?" },
        {role: "user", content: "Output to be in JSON format"},
      ];
      const input = {
        messages,
        openAIOptions: {
            response_format: { type: "json_object" },
        }
    }
  const reponse = await callOpenAIChat(input);
  console.log(reponse);
}

main(messages);
openAIJSONResponse();
