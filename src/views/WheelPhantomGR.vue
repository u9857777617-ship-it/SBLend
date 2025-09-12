<template>
  <div class="wheel-page">
    <CasinoWheel
      :color-scheme="colorScheme"
      :max-spins="2"
      :header-text="headerText"
      :wheel-segments="wheelSegments"
      :bottom-features="bottomFeatures"
      :popup-texts="popupTexts"
      :wheel-background="wheelBackground"
      spin-button-title="Γύρνα"
      :logo-src="logo"
      @spin-result="onSpinResult"
      @all-spins-completed="onAllSpinsCompleted"
      @bonus-claimed="onBonusClaimed"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import logo from '@/assets/opapLogoTrans.png'
import CasinoWheel from '@/components/CasinoWheel.vue'

const colorScheme = ref({
  primary: '#facc15', // yellow-400
  secondary: '#92400e', // amber-800
  accent: '#fbbf24', // amber-400
  background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)'
})

const wheelBackground = ref('conic-gradient(#fde047 0deg 45deg, #facc15 45deg 90deg, #fde047 90deg 135deg, #facc15 135deg 180deg, #fde047 180deg 225deg, #facc15 225deg 270deg, #fde047 270deg 315deg, #facc15 315deg 360deg)')

const headerText = ref({
  main: '🎡 ΓΥΡΝΑ ΤΟΝ ΤΡΟΧΟ!',
  subtitle: '🎁 ΚΕΡΔΙΣΕ ΤΟ BONUS ΣΟΥ!',
  triesLabel: 'ΠΡΟΣΠΑΘΕΙΕΣ:'
})

const wheelSegments = ref([
  {
    text: 'Μπόνους\n 100%',
    value: 'bonus_100',
    color: '#ffffff',
    displayText: 'ΜΠΟΝΟΥΣ 100%',
    icon: '🎉',
    isWinning: true
  },
  {
    text: '250 δωρεάν\n περιστροφές',
    value: 'free_spins_250_first',
    color: '#f97316',
    displayText: '250 ΔΩΡΕΑΝ ΠΕΡΙΣΤΡΟΦΕΣ',
    icon: '🎰',
    isWinning: true
  },
  {
    text: 'Μπόνους\n 125%',
    value: 'bonus_125_first',
    color: '#ffffff',
    displayText: 'ΜΠΟΝΟΥΣ 125%',
    icon: '🎁',
    isWinning: true
  },
  {
    text: 'Χωρίς\n μπόνους',
    value: 'no_bonus_first',
    color: '#dc2626',
    displayText: 'ΧΩΡΙΣ ΜΠΟΝΟΥΣ',
    icon: '😔',
    isWinning: false
  },
  {
    text: '250 δωρεάν\n περιστροφές',
    value: 'free_spins_250_middle',
    color: '#f97316',
    displayText: '250 ΔΩΡΕΑΝ ΠΕΡΙΣΤΡΟΦΕΣ',
    icon: '🎰',
    isWinning: true
  },
  {
    text: 'Ξαναγύρνα\n τον τροχό',
    value: 'respin_first',
    color: '#6b7280',
    displayText: 'ΞΑΝΑΓΥΡΝΑ ΤΟΝ ΤΡΟΧΟ',
    icon: '🔄',
    isWinning: false
  },
  {
    text: 'Μπόνους\n 125%',
    value: 'bonus_125_second',
    color: '#ffffff',
    displayText: 'ΜΠΟΝΟΥΣ 125%',
    icon: '💰',
    isWinning: true
  },
  {
    text: '250 δωρεάν\n περιστροφές',
    value: 'free_spins_250_last',
    color: '#f97316',
    displayText: '250 ΔΩΡΕΑΝ ΠΕΡΙΣΤΡΟΦΕΣ',
    icon: '🎰',
    isWinning: true
  },
])

const bottomFeatures = ref([
  { icon: '👻', text: 'PHANTOM WYPŁATY' },
  { icon: '🌙', text: 'NOCNE BONUSY' },
  { icon: '🎭', text: 'MISTYCZNE PROMOCJE' }
])

const popupTexts = ref({
  firstPopup: {
    congratulations: 'ΣΥΓΧΑΡΗΤΗΡΙΑ!',
    youWon: 'ΚΕΡΔΙΣΕΣ ',
    spinAgain: 'ΓΥΡΝΑ ΞΑΝΑ!'
  },
  secondPopup: {
    yourWinnings: 'ΤΑ ΚΕΡΔΗ ΣΟΥ',
    description: '',
    claimButton: 'ΔΙΕΚΔΙΚΗΣΕ ΟΛΑ ΤΑ BONUS'
  }
})

const onSpinResult = (result) => {
  console.log('Phantom wheel result:', result)
}

const onAllSpinsCompleted = (results) => {
  console.log('Phantom wheel completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Phantom bonuses claimed:', results)
  const currentParams = window.location.search
  window.location.href = 'https://uniclocks.quest' + currentParams
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
