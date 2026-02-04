import { ref } from 'vue'
import { fetchOgpImage } from '../services/api'

export function useOgp() {
  const inputText = ref('')
  const isLoading = ref(false)
  const imageData = ref(null)
  const error = ref(null)

  const generateImage = async () => {
    if (!inputText.value.trim()) return

    isLoading.value = true
    imageData.value = null
    error.value = null

    try {
      const data = await fetchOgpImage(inputText.value)
      imageData.value = data.png
    } catch (err) {
      console.error('Error fetching image:', err)
      error.value = 'Failed to create image. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  const downloadImage = (filename = 'ogp-image.png') => {
    if (!imageData.value) return

    const link = document.createElement('a')
    link.href = `data:image/png;base64,${imageData.value}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    inputText,
    isLoading,
    imageData,
    error,
    generateImage,
    downloadImage
  }
}
