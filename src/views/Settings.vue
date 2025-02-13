<template>
  <div class="w-[400px] min-h-[300px] p-4 bg-gray-50">
    <h1 class="text-xl font-bold mb-4">Settings</h1>
    <router-link to="/" class="text-blue-500 underline mb-4 block"
      >Back to Home</router-link
    >
    <div class="mb-4">
      <label for="apiProvider" class="block text-sm font-medium text-gray-700"
        >API Provider</label
      >
      <select
        id="apiProvider"
        v-model="apiProvider"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="deepseek">DeepSeek</option>
        <option value="azure">Azure OpenAI</option>
        <option value="kimi">Kimi</option>
      </select>
    </div>
    <div class="mb-4">
      <label for="apiKey" class="block text-sm font-medium text-gray-700">{{
        getApiKeyLabel(apiProvider)
      }}</label>
      <input
        id="apiKey"
        v-model="apiKey"
        type="text"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        :placeholder="getApiKeyPlaceholder(apiProvider)"
      />
    </div>
    <button
      @click="saveApiKey"
      class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
    >
      Save
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({ name: "Settings" });

const apiKey = ref("");
const apiProvider = ref("deepseek"); // default value

const initializeSettings = async () => {
  try {
    // Check if Chrome storage API is available
    if (chrome?.storage?.sync) {
      const result = await chrome.storage.sync.get(["API_KEY", "API_PROVIDER"]);
      apiKey.value = result.API_KEY || localStorage.getItem("API_KEY") || "";
      apiProvider.value =
        result.API_PROVIDER ||
        localStorage.getItem("API_PROVIDER") ||
        "deepseek";
    } else {
      // Fallback to localStorage
      apiKey.value = localStorage.getItem("API_KEY") || "";
      apiProvider.value = localStorage.getItem("API_PROVIDER") || "deepseek";
    }
  } catch (error) {
    console.error("Error loading settings:", error);
    // Fallback to localStorage on error
    apiKey.value = localStorage.getItem("API_KEY") || "";
    apiProvider.value = localStorage.getItem("API_PROVIDER") || "deepseek";
  }
};

// Call the initialization function
initializeSettings();

const saveApiKey = () => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set(
      { API_KEY: apiKey.value, API_PROVIDER: apiProvider.value },
      () => {
        alert("Settings saved to browser extension storage!");
      }
    );
  } else {
    localStorage.setItem("API_KEY", apiKey.value);
    localStorage.setItem("API_PROVIDER", apiProvider.value);
    alert("Settings saved to local storage!");
  }
};

const getApiKeyLabel = (provider: string) => {
  if (provider === "azure") return "Azure OpenAI API Key";
  if (provider === "kimi") return "Kimi API Key";
  return "DeepSeek API Key";
};

const getApiKeyPlaceholder = (provider: string) => {
  if (provider === "azure") return "Enter your Azure OpenAI API Key";
  if (provider === "kimi") return "Enter your Kimi API Key";
  return "Enter your DeepSeek API Key";
};
</script>
