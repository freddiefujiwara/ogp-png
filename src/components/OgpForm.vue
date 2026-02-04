<script setup>
defineProps({
  modelValue: String,
  isLoading: Boolean
})

defineEmits(['update:modelValue', 'submit'])
</script>

<template>
  <div class="input-section">
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Enter text here..."
      rows="5"
      maxlength="66"
    ></textarea>
    <button
      @click="$emit('submit')"
      :disabled="isLoading || !modelValue.trim()"
    >
      {{ isLoading ? 'Creating...' : 'Create' }}
    </button>
  </div>
</template>

<style scoped>
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
</style>
