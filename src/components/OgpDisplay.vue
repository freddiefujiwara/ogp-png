<script setup>
defineProps({
  imageData: String,
  isLoading: Boolean,
  error: String
})

defineEmits(['download'])
</script>

<template>
  <div class="display-section">
    <div v-if="isLoading" class="loading">
      <p>Creating...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="imageData && !isLoading" class="result-section">
      <img :src="'data:image/png;base64,' + imageData" alt="Generated OGP Image" />
      <button @click="$emit('download')" class="download-btn">Download PNG</button>
    </div>
  </div>
</template>

<style scoped>
.display-section {
  width: 100%;
}

.loading, .error {
  text-align: center;
  color: #94a3b8;
}

.error {
  color: #ef4444;
}

.result-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.download-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #10b981;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-btn:hover:not(:disabled) {
  background-color: #059669;
}
</style>
