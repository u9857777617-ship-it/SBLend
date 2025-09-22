<template>
  <div class="it-cases-view">
    <ItCasesLanding 
      :colorScheme="colorScheme"
      :texts="texts"
      :offerUrl="offerUrl"
      :logoSrc="logoSrc"
    />
  </div>
</template>

<script setup lang="ts">
import ItCasesLanding from '@/components/ItCasesLanding.vue'

const colorScheme = {
  primary: '#1a237e',
  secondary: '#3949ab', 
  accent: '#5c6bc0',
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)'
}

const texts = {
  loader: 'CARICAMENTO...',
  subtitle: 'APRI E TROVA<br>E ATTIVA IL TUO BONUS',
  bonusText: 'VINCITA<br>300 GIRI E 150 EURO<br>SUL PRIMO DEPOSITO',
  bonusButton: 'RITARE',
  bonusLoading: 'CARICAMENTO...'
}

const offerUrl = 'https://cloud-district.click/'

const logoSrc = new URL('../assets/it-cases/it-land-logo.png', import.meta.url).href
</script>

<style scoped>
.it-cases-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
