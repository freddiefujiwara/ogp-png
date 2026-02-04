<script setup>
import { ref } from 'vue'

const inputText = ref('')
const isLoading = ref(false)
const imageData = ref(null)

const fetchImage = async () => {
  if (!inputText.value.trim()) return

  isLoading.value = true
  imageData.value = null

  try {
    const encodedText = encodeURIComponent(inputText.value.trim())
    const response = await fetch(`https://script.google.com/macros/s/AKfycbzbMAKxkzHlwN8SY7ygJA34xYESMNNdkGNt8vv1XMcZSksgHsUwOxCCdP-wgg6fv7M/exec?t=${encodedText}`)
    const data = await response.json()
    imageData.value = data.png
  } catch (error) {
    console.error('Error fetching image:', error)
    alert('Failed to create image. Please try again.')
  } finally {
    isLoading.value = false
  }
}

const downloadImage = () => {
  if (!imageData.value) return

  const link = document.createElement('a')
  link.href = `data:image/png;base64,${imageData.value}`
  link.download = 'generated-image.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="container">
    <header>
      <h1>Image Creator</h1>
    </header>

    <main>
      <div class="input-section">
        <textarea
          v-model="inputText"
          placeholder="Enter text here..."
          rows="5"
        ></textarea>
        <button @click="fetchImage" :disabled="isLoading || !inputText.trim()">
          {{ isLoading ? 'Creating...' : 'Create' }}
        </button>
      </div>

      <div v-if="isLoading" class="loading">
        <p>Creating...</p>
      </div>

      <div v-if="imageData && !isLoading" class="result-section">
        <img :src="'data:image/png;base64,' + imageData" alt="Generated Image" />
        <button @click="downloadImage" class="download-btn">Download PNG</button>
      </div>
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

header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

main {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #334155;
  background-color: #1e293b;
  color: #f8fafc;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #475569;
  cursor: not-allowed;
  opacity: 0.7;
}

.loading {
  text-align: center;
  color: #94a3b8;
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
  background-color: #10b981;
}

.download-btn:hover:not(:disabled) {
  background-color: #059669;
}

@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}
</style>
