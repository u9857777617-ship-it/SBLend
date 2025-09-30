<template>
  <div class="pt-cases-andr2">
    <PtCasesLanding :colorScheme="colorScheme" :texts="texts" :offerUrl="offerUrl" />
  </div>
</template>

<script setup lang="ts">
import PtCasesLanding from '../components/PtCasesLanding.vue'

const colorScheme = {
  primary: '#1a237e',
  secondary: '#3949ab',
  accent: '#5c6bc0',
  background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)'
}

const texts = {
  loader: 'CARREGANDO...',
  subtitle: 'ABRE E ENCONTRA<br>E ATIVA O TEU BÓNUS',
  bonusText: 'VITÓRIA<br>300 RODADAS E 150 EUROS<br>NO PRIMEIRO DEPÓSITO',
  bonusButton: 'RITIRARE',
  bonusLoading: 'CARREGANDO...'
}

const offerUrl = 'https://jogonogo.sbs'
</script>

<style scoped>
.pt-cases-andr2 {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>


