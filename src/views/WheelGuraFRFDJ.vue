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
  primary: '#1e3a8a',   // deep blue
  secondary: '#2563eb', // vibrant blue
  accent: '#60a5fa',
  background: 'radial-gradient(ellipse at center, #1e3a8a 0%, #0f172a 100%)'
})

const onSpinResult = (result) => {
  console.log('Green wheel result:', result)

}

const onAllSpinsCompleted = (results) => {
  console.log('Green wheel completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Green bonuses claimed:', results)
  const currentParams = window.location.search
  window.location.href = 'https://illiko.sbs' + currentParams
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
