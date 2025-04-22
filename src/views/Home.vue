<template>
  <div class="min-h-[300px] p-4 bg-gray-50">
    <router-link to="/settings" class="text-blue-500 underline mb-4 block"
      >Settings</router-link
    >
    <!-- Input Section -->
    <div class="mb-4">
      <div class="relative">
        <textarea
          v-model="inputText"
          class="w-full h-24 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter text to translate or polish..."
        ></textarea>
        <button
          v-if="inputText"
          @click="inputText = ''"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 mb-4">
      <button
        @click="translateToChinese"
        class="flex-1 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        :disabled="isLoading"
      >
        To Chinese
      </button>
      <button
        @click="translateToEnglish"
        class="flex-1 px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        :disabled="isLoading"
      >
        To English
      </button>
      <button
        @click="generateCucumberSyntax"
        class="flex-1 px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        :disabled="isLoading"
      >
        To Cucumber
      </button>      <button
        @click="polishEnglish"
        class="flex-1 px-2 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
        :disabled="isLoading"
      >
        Polish
      </button>      <div class="relative">
        <button
          class="flex-1 px-2 py-1 text-gray-700 hover:text-blue-600 transition"
          aria-label="More options"
          @mouseenter="isHovering = true"
          @mouseleave="isHovering = false"
        >
          <div class="w-5 h-5 flex flex-col items-center justify-center mx-auto">
            <span class="w-1 h-1 bg-current rounded-full mb-0.5"></span>
            <span class="w-1 h-1 bg-current rounded-full mb-0.5"></span>
            <span class="w-1 h-1 bg-current rounded-full"></span>
          </div>
        </button>        <div
          class="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg transition-all duration-300 z-10"
          :class="{ 'opacity-0 invisible': !keepDropdownOpen && !isHovering, 'opacity-100 visible': keepDropdownOpen || isHovering }"
          @mouseenter="keepDropdownOpen = true"
          @mouseleave="keepDropdownOpen = false"
        >        
          <button
            @click="translateWordWithEtymology"
            class="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            :disabled="isLoading"
          >
            单词词根
          </button>
          <button
            @click="summarizeCurrentPage"
            class="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            :disabled="isLoading"
          >
            Summarize Web
          </button>
  
        </div>
      </div>
    </div>

    <!-- Output Section -->
    <div v-if="isLoading" class="text-center py-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
      ></div>
    </div>

    <div v-if="outputText" class="border rounded-lg p-3 bg-white">
      <h2 class="font-semibold mb-2">Result:</h2>
      <p class="whitespace-pre-wrap">{{ outputText }}</p>
      <button
        @click="copyToClipboard"
        class="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        Copy Result
      </button>
    </div>

    <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  translateText,
  polishText,
  summarizeText,
  generateCucumberSyntax as generateCucumberSyntaxAPI,
  translateWordWithEtymology as translateWordWithEtymologyAPI,
} from "../services/deepseek";
defineOptions({ name: "Home" });

const inputText = ref("");
const outputText = ref("");
const isLoading = ref(false);
const error = ref("");

const translateToChinese = async () => {
  if (!inputText.value) return;
  try {
    isLoading.value = true;
    error.value = "";
    outputText.value = await translateText(inputText.value, "en", "zh");
  } catch (err) {
    error.value = "Translation failed. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const translateToEnglish = async () => {
  if (!inputText.value) return;
  try {
    isLoading.value = true;
    error.value = "";
    outputText.value = await translateText(inputText.value, "zh", "en");
  } catch (err) {
    error.value = "Translation failed. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const polishEnglish = async () => {
  if (!inputText.value) return;
  try {
    isLoading.value = true;
    error.value = "";
    outputText.value = await polishText(inputText.value);
  } catch (err) {
    error.value = "Polishing failed. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const summarizeCurrentPage = async () => {
  try {
    isLoading.value = true;
    error.value = "";
    chrome.storage.local.get("pageContent", async (data) => {
      if (data.pageContent) {
        outputText.value = await summarizeText(data.pageContent);
      } else {
        error.value = "Failed to get page content.";
      }
    });
  } catch (err) {
    error.value = "Summarization failed. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const copyToClipboard = async () => {
  if (!outputText.value) return;
  try {
    await navigator.clipboard.writeText(outputText.value);
  } catch (err) {
    error.value = "Failed to copy. Please try again.";
    console.error(err);
  }
};

const generateCucumberSyntax = async () => {
  if (!inputText.value) return;
  try {
    isLoading.value = true;
    error.value = "";
    outputText.value = await generateCucumberSyntaxAPI(inputText.value);
  } catch (err) {
    error.value = "Failed to generate Cucumber syntax. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const translateWordWithEtymology = async () => {
  if (!inputText.value) return;
  try {
    isLoading.value = true;
    error.value = "";
    outputText.value = await translateWordWithEtymologyAPI(inputText.value);
  } catch (err) {
    error.value = "Failed to translate word and explain etymology. Please try again.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// State for dropdown menu
const keepDropdownOpen = ref(false);
const isHovering = ref(false);
</script>
