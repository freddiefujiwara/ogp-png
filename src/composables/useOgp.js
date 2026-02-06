import { ref } from 'vue'
import { fetchOgpImage } from '../services/api'
import { truncateToWeightedLength } from '../services/textUtils'

export function useOgp() {
  const inputText = ref('')
  const isLoading = ref(false)
  const imageData = ref(null)
  const error = ref(null)

  const isShareSupported = () => {
    if (typeof navigator === 'undefined') return false

    const isMobileDevice =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '') ||
      navigator.userAgentData?.mobile === true

    return isMobileDevice && typeof navigator.share === 'function'
  }

  const base64ToBlob = (base64, type) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i += 1) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    return new Blob([new Uint8Array(byteNumbers)], { type })
  }

  const generateImage = async () => {
    if (!inputText.value.trim()) return

    // Limit text to weighted 66 units (66 half-width or 40 full-width)
    const text = truncateToWeightedLength(inputText.value, 66)

    isLoading.value = true
    imageData.value = null
    error.value = null

    try {
      const data = await fetchOgpImage(text)
      imageData.value = data.png
    } catch (err) {
      console.error('Error fetching image:', err)
      error.value = 'Failed to create image. Please try again.'
    } finally {
      isLoading.value = false
    }
  }

  const downloadImage = async (filename = 'ogp-image.png') => {
    if (!imageData.value) return

    if (isShareSupported()) {
      const blob = base64ToBlob(imageData.value, 'image/png')
      const shareFiles = [new File([blob], filename, { type: 'image/png' })]

      const canShareFiles =
        typeof navigator.canShare === 'function'
          ? navigator.canShare({ files: shareFiles })
          : true

      if (canShareFiles) {
        try {
          await navigator.share({
            files: shareFiles,
            title: 'OGP'
          })
          return
        } catch (error) {
          // Fall back to sequential downloads if sharing is dismissed or fails.
        }
      }
    }

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
    downloadImage,
    isShareSupported
  }
}
