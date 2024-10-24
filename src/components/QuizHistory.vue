<script setup lang="ts">
import { computed } from 'vue'
import type { QuizAttempt } from '../types/quiz'
import LineGraph from './LineGraph.vue'

const props = defineProps<{
  attempts: QuizAttempt[]
}>()

const emit = defineEmits<{
  (e: 'clearHistory'): void
}>()

const sortedAttempts = computed(() => {
  return [...props.attempts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const averageScore = computed(() => {
  if (props.attempts.length === 0) return 0
  const sum = props.attempts.reduce((acc, attempt) => acc + attempt.percentage, 0)
  return Math.round(sum / props.attempts.length)
})

const bestScore = computed(() => {
  if (props.attempts.length === 0) return 0
  return Math.max(...props.attempts.map(a => a.percentage))
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Quiz History</h2>
      <button
        v-if="attempts.length > 0"
        @click="emit('clearHistory')"
        class="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
      >
        Clear History
      </button>
    </div>

    <div v-if="attempts.length > 0" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-emerald-50 p-4 rounded-lg">
          <div class="text-sm text-emerald-600 mb-1">Average Score</div>
          <div class="text-2xl font-bold text-emerald-700">{{ averageScore }}%</div>
        </div>
        <div class="bg-emerald-50 p-4 rounded-lg">
          <div class="text-sm text-emerald-600 mb-1">Best Score</div>
          <div class="text-2xl font-bold text-emerald-700">{{ bestScore }}%</div>
        </div>
      </div>

      <!-- Progress Graph -->
      <div v-if="attempts.length >= 2" class="border rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
        <LineGraph :attempts="attempts" />
      </div>

      <div class="space-y-4">
        <div
          v-for="attempt in sortedAttempts"
          :key="attempt.id"
          class="border rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="flex justify-between items-center">
            <div>
              <div class="text-sm text-gray-500">{{ formatDate(attempt.date) }}</div>
              <div class="font-medium">
                Score: {{ attempt.score }}/{{ attempt.totalQuestions }}
              </div>
            </div>
            <div class="text-lg font-semibold text-emerald-600">
              {{ attempt.percentage }}%
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-8">
      No quiz attempts yet. Take the quiz to see your history!
    </div>
  </div>
</template>