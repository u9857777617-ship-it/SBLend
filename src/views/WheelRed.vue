<template>
  <div class="wheel-page">
    <CasinoWheel
      :color-scheme="colorScheme"
      :max-spins="2"
      :header-text="headerText"
      :wheel-segments="wheelSegments"
      :bottom-features="bottomFeatures"
      :popup-texts="popupTexts"
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
  primary: '#7f1d1d',
  secondary: '#dc2626',
  accent: '#f87171',
  background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)'
})

const headerText = ref({
  main: 'OGNISTE KOŁO SZCZĘŚCIA',
  subtitle: 'PŁONĄCE NAGRODY DO WYGRANIA',
  triesLabel: 'SZANSE:'
})

const wheelSegments = ref([
  {
    text: 'PŁONĄCY JACKPOT\n(777% bonus)',
    value: 'fire_jackpot',
    color: '#7f1d1d',
    displayText: '777% PŁONĄCY JACKPOT',
    icon: '🔥',
    isWinning: true
  },
  {
    text: 'Ognisty Spin',
    value: 'fire_spin',
    color: '#991b1b',
    displayText: 'OGNISTY SPIN',
    icon: '🌋',
    isWinning: true
  },
  {
    text: 'Diabelski Bonus\n(300% extra)',
    value: 'devil_bonus',
    color: '#7f1d1d',
    displayText: '300% DIABELSKI BONUS',
    icon: '😈',
    isWinning: true
  },
  {
    text: 'Spalone',
    value: 'burned',
    color: '#991b1b',
    displayText: 'SPALONE - BEZ NAGRODY',
    icon: '💨',
    isWinning: false
  },
  {
    text: 'Czerwone Karty\n(2000 punktów)',
    value: 'red_cards',
    color: '#7f1d1d',
    displayText: '2000 CZERWONYCH PUNKTÓW',
    icon: '♠️',
    isWinning: true
  },
  {
    text: 'Kolejna Szansa',
    value: 'another_chance',
    color: '#991b1b',
    displayText: 'KOLEJNA OGNISTA SZANSA',
    icon: '🎲',
    isWinning: true
  },
  {
    text: 'VIP Diament\n(premium dostęp)',
    value: 'diamond_vip',
    color: '#7f1d1d',
    displayText: 'DIAMENTOWY STATUS VIP',
    icon: '💎',
    isWinning: true
  },
  {
    text: 'Przegrana',
    value: 'loss',
    color: '#991b1b',
    displayText: 'PRZEGRANA - NASTĘPNY RAZ SZCZĘŚCIE',
    icon: '😵',
    isWinning: false
  }
])

const bottomFeatures = ref([
  { icon: '🔥', text: 'OGNISTE WYPŁATY' },
  { icon: '🌶️', text: 'OSTRE BONUSY' },
  { icon: '💥', text: 'WYBUCHOWE PROMOCJE' }
])

const popupTexts = ref({
  firstPopup: {
    congratulations: 'OGIEŃ',
    youWon: 'SPALIŁEŚ KONKURENCJĘ',
    spinAgain: 'NASTĘPNY OGIEŃ!'
  },
  secondPopup: {
    yourWinnings: 'TWOJE OGNISTE ZDOBYCZE',
    description: 'Zgarnij swoje płonące nagrody już teraz!',
    claimButton: '🔥 ODBIERZ OGNISTE BONUSY 🔥'
  }
})

const onSpinResult = (result) => {
  console.log('Red wheel result:', result)
}

const onAllSpinsCompleted = (results) => {
  console.log('Red wheel completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Red bonuses claimed:', results)
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
