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
  primary: '#581c87',
  secondary: '#7c3aed',
  accent: '#a855f7',
  background: 'linear-gradient(135deg, #581c87 0%, #6b21a8 100%)'
})

const headerText = ref({
  main: 'KRÓLEWSKIE KOŁO MAJESTATU',
  subtitle: 'LUKSUSOWE NAGRODY DLA ELIT',
  triesLabel: 'PRÓBY KRÓLEWSKIE:'
})

const wheelSegments = ref([
  {
    text: 'KRÓLEWSKA FORTUNA\n(1000% bonus)',
    value: 'royal_fortune',
    color: '#581c87',
    displayText: '1000% KRÓLEWSKA FORTUNA',
    icon: '👑',
    isWinning: true
  },
  {
    text: 'Magiczny Spin',
    value: 'magic_spin',
    color: '#6b21a8',
    displayText: 'MAGICZNY SPIN',
    icon: '🔮',
    isWinning: true
  },
  {
    text: 'Fioletowy Skarb\n(luksus premium)',
    value: 'purple_treasure',
    color: '#581c87',
    displayText: 'FIOLETOWY SKARB PREMIUM',
    icon: '💜',
    isWinning: true
  },
  {
    text: 'Klątwa',
    value: 'curse',
    color: '#6b21a8',
    displayText: 'KLĄTWA - BRAK NAGRODY',
    icon: '🦇',
    isWinning: false
  },
  {
    text: 'Luksusowe Żetony\n(5000 platinum)',
    value: 'luxury_tokens',
    color: '#581c87',
    displayText: '5000 PLATYNOWYCH ŻETONÓW',
    icon: '🎖️',
    isWinning: true
  },
  {
    text: 'Mistyczny Bonus',
    value: 'mystic_bonus',
    color: '#6b21a8',
    displayText: 'MISTYCZNY BONUS',
    icon: '🌙',
    isWinning: true
  },
  {
    text: 'VIP Imperator\n(najwyższy status)',
    value: 'emperor_vip',
    color: '#581c87',
    displayText: 'STATUS VIP IMPERATORA',
    icon: '⚜️',
    isWinning: true
  },
  {
    text: 'Przeklęte',
    value: 'cursed',
    color: '#6b21a8',
    displayText: 'PRZEKLĘTE - SPRÓBUJ ZNOWU',
    icon: '🔮',
    isWinning: false
  }
])

const bottomFeatures = ref([
  { icon: '👑', text: 'KRÓLEWSKIE WYPŁATY' },
  { icon: '💎', text: 'LUKSUSOWE BONUSY' },
  { icon: '⚜️', text: 'ELITARNE PROMOCJE' }
])

const popupTexts = ref({
  firstPopup: {
    congratulations: 'MAJESTAT',
    youWon: 'ZDOBYŁEŚ KORONĘ',
    spinAgain: 'NASTĘPNY SKARB!'
  },
  secondPopup: {
    yourWinnings: 'TWOJE KRÓLEWSKIE ZDOBYCZE',
    description: 'Odbierz swoje luksusowe nagrody godne królów!',
    claimButton: '👑 ODBIERZ KRÓLEWSKIE BONUSY 👑'
  }
})

const onSpinResult = (result) => {
  console.log('Purple wheel result:', result)
}

const onAllSpinsCompleted = (results) => {
  console.log('Purple wheel completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Purple bonuses claimed:', results)
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
