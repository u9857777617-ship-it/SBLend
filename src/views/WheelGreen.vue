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
  primary: '#065f46',
  secondary: '#059669',
  accent: '#34d399',
  background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)'
})

const headerText = ref({
  main: 'ZAKRĘĆ KOŁEM FORTUNY',
  subtitle: 'ZIELONE JACKPOTY CZEKAJĄ',
  triesLabel: 'POZOSTAŁE PRÓBY:'
})

const wheelSegments = ref([
  {
    text: 'MEGA JACKPOT\n(500% bonus)',
    value: 'mega_jackpot',
    color: '#065f46',
    displayText: '500% MEGA JACKPOT BONUS',
    icon: '💎',
    isWinning: true
  },
  {
    text: 'Kolejny Los',
    value: 'respin',
    color: '#047857',
    displayText: 'DODATKOWY LOS',
    icon: '🍀',
    isWinning: true
  },
  {
    text: 'Cashback 50%\n(zwrot gotówki)',
    value: 'cashback_50',
    color: '#065f46',
    displayText: '50% CASHBACK - ZWROT GOTÓWKI',
    icon: '💵',
    isWinning: true
  },
  {
    text: 'Pudło',
    value: 'no_prize',
    color: '#047857',
    displayText: 'PUDŁO - SPRÓBUJ PONOWNIE',
    icon: '🚫',
    isWinning: false
  },
  {
    text: '1000 żetonów\n(za darmo)',
    value: 'free_tokens',
    color: '#065f46',
    displayText: '1000 DARMOWYCH ŻETONÓW',
    icon: '🪙',
    isWinning: true
  },
  {
    text: 'Bonus Spin',
    value: 'bonus_spin',
    color: '#047857',
    displayText: 'BONUS SPIN',
    icon: '🎰',
    isWinning: true
  },
  {
    text: 'VIP Status\n(złoty członek)',
    value: 'vip_gold',
    color: '#065f46',
    displayText: 'ZŁOTY STATUS VIP',
    icon: '👑',
    isWinning: true
  },
  {
    text: 'Pech',
    value: 'bad_luck',
    color: '#047857',
    displayText: 'PECH - NASTĘPNYM RAZEM SZCZĘŚCIE',
    icon: '💔',
    isWinning: false
  }
])

const bottomFeatures = ref([
  { icon: '🌿', text: 'EKOLOGICZNE WYPŁATY' },
  { icon: '💚', text: 'ZIELONE BONUSY' },
  { icon: '🍀', text: 'SZCZĘŚLIWE PROMOCJE' }
])

const popupTexts = ref({
  firstPopup: {
    congratulations: 'BRAWO',
    youWon: 'WYGRAŁEŚ',
    spinAgain: 'NASTĘPNY LOS!'
  },
  secondPopup: {
    yourWinnings: 'TWOJE ZIELONE WYGRANE',
    description: 'Wypełnij formularz aby odebrać nagrody!',
    claimButton: '🍀 ODBIERZ ZIELONE BONUSY 🍀'
  }
})

const onSpinResult = (result) => {
  console.log('Green wheel result:', result)
}

const onAllSpinsCompleted = (results) => {
  console.log('Green wheel completed:', results)
}

const onBonusClaimed = (results) => {
  console.log('Green bonuses claimed:', results)
}
</script>

<style scoped>
.wheel-page {
  width: 100%;
  min-height: 100vh;
}
</style>
