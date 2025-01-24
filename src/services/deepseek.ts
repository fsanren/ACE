import axios from "axios";

const DEEPSEEK_API_KEY = "sk-474261b187c64a78bad89dc74601c69f";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const client = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  let apiKey = localStorage.getItem("DEEPSEEK_API_KEY");
  if (typeof chrome !== "undefined" && chrome.storage) {
    apiKey = await new Promise((resolve) => {
      chrome.storage.sync.get("DEEPSEEK_API_KEY", (items) => {
        resolve(items.DEEPSEEK_API_KEY || apiKey);
      });
    });
  }
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  return config;
});

export async function translateText(
  text: string,
  from: "en" | "zh",
  to: "en" | "zh"
): Promise<string> {
  try {
    const prompt = `Translate the following ${
      from === "en" ? "English" : "Chinese"
    } text to ${
      to === "en" ? "English" : "Chinese"
    }. Only return the translated text:\n\n${text}`;

    const response = await client.post("", {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}

export async function polishText(text: string): Promise<string> {
  try {
    const prompt = `Please polish and improve the following English text while maintaining its original meaning. Make it brief and correct grammar or other errors. Only return the polished text:\n\n${text}`;

    const response = await client.post("", {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Polishing error:", error);
    throw new Error("Failed to polish text");
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const prompt = `请总结以下内容，用中文回答。只返回总结内容:\n\n${text}`;

    const response = await client.post("", {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize text");
  }
}

export async function generateCucumberSyntax(text: string): Promise<string> {
  try {
    const prompt = `Generate Cucumber syntax for the following text. Only return the Cucumber syntax:\n\n${text}`;

    const response = await client.post("", {
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Cucumber syntax generation error:", error);
    throw new Error("Failed to generate Cucumber syntax");
  }
}
