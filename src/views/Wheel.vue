<template>
  <div class="wheel-page">
    <CasinoWheel
      :color-scheme="colorScheme"
      :max-spins="2"
      @spin-result="onSpinResult"
      @all-spins-completed="onAllSpinsCompleted"
      @bonus-claimed="onBonusClaimed"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CasinoWheel from '@/components/CasinoWheel.vue'

const colorScheme = ref({
  primary: '#1e3a8a',
  secondary: '#f97316',
  accent: '#b45309',
  background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)'
})

const onSpinResult = (result) => {
  console.log('Spin result:', result)
}

const onAllSpinsCompleted = (results) => {
  console.log('All spins completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Bonus claimed with results:', results)
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
