const BASE_URL = 'https://script.google.com/macros/s/AKfycbzbMAKxkzHlwN8SY7ygJA34xYESMNNdkGNt8vv1XMcZSksgHsUwOxCCdP-wgg6fv7M/exec'

export const fetchOgpImage = async (text) => {
  const encodedText = encodeURIComponent(text.trim())
  const response = await fetch(`${BASE_URL}?t=${encodedText}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return await response.json()
}
