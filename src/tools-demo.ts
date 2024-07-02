import OpenAI from "openai";
import axios from "axios";
import { callOpenAIChat } from "./utils";

const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentTemperatureForLatLong",
      description: "Get the current weather",
      parameters: {
        type: "object",
        properties: {
          latitude: {
            type: "string",
            description: "Latitude of a given city",
          },
          longitude: {
            type: "string",
            description: "Longitude of a given city",
          },
        },
        required: ["latitude", "longitude"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "getLatLongForCity",
      description: "Get the Latitude and Longitude for a city",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Name of a given city",
          },
        },
        required: ["name"],
      },
    },
  },
];

async function getLatLongForCity({ name }: { name: string }): Promise<string> {
  const citiesDetails = {
    "San Francisco": {
      latitude: "37.615223",
      longitude: "-122.389977",
    },
  };
  if (name.includes("San Francisco")) {
    //@ts-ignore
    return Promise.resolve(citiesDetails["San Francisco"]);
  } else {
    return Promise.reject("Unknown City");
  }
}

async function getCurrentTemperatureForLatLong({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<string> {
  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        current: "temperature_2m",
        hourly:
          "temperature_2m,relative_humidity_2m,precipitation,rain,showers",
      },
    });
    const weatherForecastData = response.data;
    return JSON.stringify(weatherForecastData);
  } catch (error) {
    throw new Error(
      `Could not fetch temperature for coordinates (${latitude}, ${longitude}).`
    );
  }
}

const messages = [
  {
    role: "system",
    content:
      "You are a helpful assistant that can provide information on temperature for given city using its latitude longitude. Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous.",
  },
  {
    role: "user",
    content:
      "what is the weather of San Francisco, USA? Will i be able to go out and enjoy the beach with kids? Should i take umbrella or rain coats",
  },
];

async function openAIToolsSampleMain(messages: any[]) {
  const inputOptions = {
    tools,
    tool_choice: "auto",
  };

  const response = await callOpenAIChat({
    messages,
    openAIOptions: inputOptions,
  });

  const {
    //@ts-ignore
    finish_reason,
    //@ts-ignore
    message: { tool_calls },
  } = response;
  const shouldInvokeToolsFunction = finish_reason === "tool_calls";

  if (shouldInvokeToolsFunction) {
    const availableFunctions = {
      getCurrentTemperatureForLatLong: getCurrentTemperatureForLatLong,
      getLatLongForCity: getLatLongForCity,
    };

    for (const toolCall of tool_calls) {
      const { name: toolCallFunctionName, arguments: toolCallArgs } =
        toolCall.function;
      //@ts-ignore
      const functionToCall = availableFunctions[toolCallFunctionName];
      const functionArgs = JSON.parse(toolCallArgs);

      const functionResponse = await functionToCall({ ...functionArgs });
      //@ts-ignore
      messages.push(response.message);
      messages.push({
        role: "tool",
        name: toolCallFunctionName,
        content: JSON.stringify(functionResponse),
        tool_call_id: toolCall.id,
      });
    }

    openAIToolsSampleMain(messages);
  } else {
    console.log(JSON.stringify(response));
  }
}

openAIToolsSampleMain(messages);
