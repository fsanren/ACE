import axios from "axios";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const AZURE_API_URL = "https://api.openai.azure.com/v1/chat/completions";
const KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions";

const client = axios.create({
  baseURL: DEEPSEEK_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  let apiKey = localStorage.getItem("API_KEY");
  let apiProvider = localStorage.getItem("API_PROVIDER") || "deepseek";
  if (typeof chrome !== "undefined" && chrome.storage) {
    const storage = await new Promise((resolve) => {
      chrome.storage.sync.get(["API_KEY", "API_PROVIDER"], (items) => {
        resolve(items);
      });
    });
    const typedStorage = storage as { API_KEY?: string; API_PROVIDER?: string };
    apiKey = typedStorage.API_KEY || apiKey;
    apiProvider = typedStorage.API_PROVIDER || apiProvider;
  }
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`;
  }
  config.baseURL = getApiUrl(apiProvider);
  return config;
});

const getApiUrl = (provider: string) => {
  if (provider === "azure") return AZURE_API_URL;
  if (provider === "kimi") return KIMI_API_URL;
  return DEEPSEEK_API_URL;
};

async function makeRequest(prompt: string, temperature: number) {
  const apiProvider = localStorage.getItem("API_PROVIDER") || "deepseek";
  const model = getModel(apiProvider);

  const response = await client.post("", {
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature,
  });

  return response.data.choices[0].message.content.trim();
}

const getModel = (provider: string) => {
  if (provider === "azure") return "azure-chat";
  if (provider === "kimi") return "moonshot-v1-8k";
  return "deepseek-chat";
};

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

    return await makeRequest(prompt, 0.7);
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Failed to translate text");
  }
}

export async function polishText(text: string): Promise<string> {
  try {
    const prompt = `Please polish and improve the following English text while maintaining its original meaning. Make it brief and correct grammar or other errors. Only return the polished text:\n\n${text}`;

    return await makeRequest(prompt, 0.4);
  } catch (error) {
    console.error("Polishing error:", error);
    throw new Error("Failed to polish text");
  }
}

export async function summarizeText(text: string): Promise<string> {
  try {
    const prompt = `请总结以下内容，用中文回答。只返回总结内容:\n\n${text}`;

    return await makeRequest(prompt, 0.7);
  } catch (error) {
    console.error("Summarization error:", error);
    throw new Error("Failed to summarize text");
  }
}

export async function generateCucumberSyntax(text: string): Promise<string> {
  try {
    const prompt = `Generate Cucumber syntax for the following text. Only return the Cucumber syntax:\n\n${text}`;

    return await makeRequest(prompt, 0.3);
  } catch (error) {
    console.error("Cucumber syntax generation error:", error);
    throw new Error("Failed to generate Cucumber syntax");
  }
}
