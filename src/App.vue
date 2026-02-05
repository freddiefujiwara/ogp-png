<script setup>
import { computed } from 'vue'
import { useOgp } from './composables/useOgp'
import AppHeader from './components/AppHeader.vue'
import OgpForm from './components/OgpForm.vue'
import OgpDisplay from './components/OgpDisplay.vue'

const {
  inputText,
  isLoading,
  imageData,
  error,
  generateImage,
  downloadImage,
  isShareSupported
} = useOgp()

const actionLabel = computed(() =>
  isShareSupported() ? 'Share PNG' : 'Download PNG'
)
</script>

<template>
  <div class="container">
    <AppHeader />

    <main>
      <OgpForm
        v-model="inputText"
        :is-loading="isLoading"
        @submit="generateImage"
      />

      <OgpDisplay
        :image-data="imageData"
        :is-loading="isLoading"
        :error="error"
        :action-label="actionLabel"
        @download="downloadImage"
      />
    </main>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  color: #e2e8f0;
  background-color: #0f172a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}
</style>
