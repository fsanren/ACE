<template>
  <div class="min-h-[300px] p-4 bg-gray-50">
    <router-link to="/" class="text-blue-500 underline mb-4 block"
      >Back to Home</router-link
    >
    <h1 class="text-xl font-bold mb-4">Favorites</h1>
    
    <div v-if="isLoading" class="text-center py-4">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
      ></div>
    </div>
    
    <div v-else-if="favorites.length === 0" class="text-center py-4">
      <p class="text-gray-500">No favorites yet. Try saving some word etymologies!</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="favorite in favorites" 
        :key="favorite.id"
        class="border rounded-lg p-3 bg-white"
      >
        <div class="flex justify-between items-start">
          <h2 class="font-semibold mb-2">{{ favorite.input }}</h2>
          <button 
            @click="removeFromFavorites(favorite.id)"
            class="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
        <p class="whitespace-pre-wrap">{{ favorite.output }}</p>
        <div class="mt-2 text-xs text-gray-500">
          Saved: {{ new Date(favorite.createdAt).toLocaleString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

defineOptions({ name: "Favorites" });

const favorites = ref<any[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    if (chrome?.storage?.local) {
      const result = await chrome.storage.local.get(["favorites"]);
      favorites.value = result.favorites || [];
    } else {
      const savedFavorites = localStorage.getItem("favorites");
      favorites.value = savedFavorites ? JSON.parse(savedFavorites) : [];
    }
  } catch (err) {
    console.error("Failed to load favorites:", err);
    favorites.value = [];
  } finally {
    isLoading.value = false;
  }
});

const removeFromFavorites = async (id: number) => {
  try {
    if (chrome?.storage?.local) {
      const result = await chrome.storage.local.get(["favorites"]);
      const savedFavorites = result.favorites || [];
      const updatedFavorites = savedFavorites.filter((fav: any) => fav.id !== id);
      await chrome.storage.local.set({ favorites: updatedFavorites });
      favorites.value = updatedFavorites;
    } else {
      const savedFavorites = localStorage.getItem("favorites");
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      const updatedFavorites = parsedFavorites.filter((fav: any) => fav.id !== id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      favorites.value = updatedFavorites;
    }
  } catch (err) {
    console.error("Failed to remove from favorites:", err);
  }
};
</script>