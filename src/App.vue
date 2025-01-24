<template>
  <div>
    <!-- Add router-view to display settings page -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
router.push("/");
</script>
