<template>
  <div class="w-[400px] min-h-[300px] p-4 bg-gray-50">
    <h1 class="text-xl font-bold mb-4">Settings</h1>
    <router-link to="/" class="text-blue-500 underline mb-4 block"
      >Back to Home</router-link
    >
    <div class="mb-4">
      <label for="apiKey" class="block text-sm font-medium text-gray-700"
        >DEEPSEEK API Key</label
      >
      <input
        id="apiKey"
        v-model="apiKey"
        type="text"
        class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your DEEPSEEK API Key"
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

const apiKey = ref(localStorage.getItem("DEEPSEEK_API_KEY") || "");

const saveApiKey = () => {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set({ DEEPSEEK_API_KEY: apiKey.value }, () => {
      alert("API Key saved to browser extension storage!");
    });
  } else {
    localStorage.setItem("DEEPSEEK_API_KEY", apiKey.value);
    alert("API Key saved to local storage!");
  }
};
</script>
