<template>
  <div class="casino-wheel-container" :class="{ 'spinning': isSpinning }">
    <!-- Audio element for spin sound -->
    <audio ref="spinAudio" preload="auto" loop>
      <source src="@/assets/sound/spinSound.mp3" type="audio/mpeg">
    </audio>
    <audio ref="winAudio1" preload="auto">
      <source src="@/assets/sound/winSound1.mp3" type="audio/mpeg">
    </audio>
    <audio ref="winAudio2" preload="auto">
      <source src="@/assets/sound/winSound2.mp3" type="audio/mpeg">
    </audio>

    <!-- Decorative corners -->
    <div class="decorative-corners">
      <div class="corner corner-top-left"></div>
      <div class="corner corner-top-right"></div>
      <div class="corner corner-bottom-left"></div>
      <div class="corner corner-bottom-right"></div>
      <div class="plus-pattern">
        <div v-for="i in 20" :key="i" class="plus" :style="getPlusPosition(i)">+</div>
      </div>
    </div>

    <!-- Header text -->
    <div class="header-text">
      <h1>{{ props.headerText.main }}</h1>
      <div class="tries-counter">{{ props.headerText.triesLabel }} {{ remainingSpins }}</div>
    </div>

    <!-- Floating coins -->
    <div class="floating-coins" :class="{ 'coins-spinning': isSpinning }">
      <div v-for="i in 12" :key="i" class="coin" :style="getCoinPosition(i)"></div>
    </div>

    <!-- Main wheel wrapper -->
    <div class="wheel-wrapper" :class="{ 'wrapper-spinning': isSpinning }">
      <div class="wheel-container">
        <div
          class="wheel"
          :style="{ transform: `rotate(${wheelRotation}deg)` }"
          :class="{ spinning: isSpinning, 'mega-spin': isSpinning }"
        >
          <div
            v-for="(segment, index) in segments"
            :key="index"
            class="segment"
            :class="{
              'winning-segment': winningSegmentIndex === index && !isSpinning,
              'losing-segment': !segment.isWinning
            }"
            :style="getSegmentStyle(index)"
          >
            <div class="segment-content">
              <div class="segment-text">{{ segment.text }}</div>
              <div v-if="segment.isWinning" class="star-decoration">★</div>
              <div v-else class="losing-decoration">✕</div>
            </div>
          </div>
        </div>

        <!-- Center spin button -->
        <button
          class="spin-button"
          :disabled="isSpinning || remainingSpins === 0"
          :style="{ backgroundColor: colorScheme.secondary }"
          @click="spin"
        >
          <span>{{ spinButtonTitle }}</span>
        </button>

        <!-- Pointer -->
        <div class="wheel-pointer" :class="{ 'pointer-spinning': isSpinning }"></div>
      </div>
    </div>

    <!-- Casino name and logo -->
    <div class="casino-branding">
      <div class="casino-logo">
        <img :src="logoSrc" alt="Casino Logo" class="logo-image" />
      </div>
</div>

    <!-- Popup overlay -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content" @click.stop>
        <!-- First popup -->
        <div v-if="popupType === 'first'" class="popup first-popup">
          <div class="popup-fireworks">
            <div v-for="i in 5" :key="i" class="firework" :style="getFireworkStyle(i)"></div>
          </div>
          <div class="popup-header">
            <h2 class="celebration-text">{{ props.popupTexts.firstPopup.congratulations }}</h2>
            <div class="winning-announcement">{{ props.popupTexts.firstPopup.youWon }}:</div>
            <div class="prize-text pulsing-prize">{{ lastPrize }}</div>
          </div>
          <button class="popup-button gambling-button" :style="{ backgroundColor: colorScheme.secondary }" @click="closePopup">
            {{ props.popupTexts.firstPopup.spinAgain }}
          </button>
        </div>

        <!-- Second popup -->
        <div v-if="popupType === 'second'" class="popup second-popup">
          <div class="popup-confetti">
            <div v-for="i in 10" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
          </div>
          <div class="popup-header">
            <h2 class="celebration-text mega-win">🎊 {{ props.popupTexts.secondPopup.yourWinnings }} 🎊</h2>
            <div class="all-winnings">
              <div v-for="(winning, index) in allWinnings" :key="index" class="winning-item">
                <span class="winning-icon">{{ winning.icon }}</span>
                <span class="winning-text">{{ winning.displayText }}</span>
              </div>
            </div>
            <p class="bonus-description">{{ props.popupTexts.secondPopup.description }}</p>
          </div>
          <button class="popup-button gambling-button claim-button" :style="{ backgroundColor: colorScheme.secondary }" @click="claimBonus">
            {{ props.popupTexts.secondPopup.claimButton }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {useHead} from '@unhead/vue'
import fdjLogoDefault from '@/assets/fdjLogo.png'

const props = defineProps({
  casinoName: {
    type: String,
    default: 'WILDSINO'
  },
  casinoBy: {
    type: String,
    default: 'par'
  },
  colorScheme: {
    type: Object,
    default: () => ({
      primary: '#1e40af',
      secondary: '#ffffff',
      accent: '#3b82f6',
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
    })
  },
  maxSpins: {
    type: Number,
    default: 2
  },
  spinDuration: {
    type: Number,
    default: 4000
  },
  spinButtonTitle: {
    type: String,
    default: 'Tourner'
  },
  wheelBackground: {
    type: String,
    default: 'conic-gradient(#1e3a8a 0deg 45deg, #1e40af 45deg 90deg, #1e3a8a 90deg 135deg, #1e40af 135deg 180deg, #1e3a8a 180deg 225deg, #1e40af 225deg 270deg, #1e3a8a 270deg 315deg, #1e40af 315deg 360deg)'
  },
  logoSrc: {
    type: String,
    default: fdjLogoDefault
  },
  headerText: {
    type: Object,
    default: () => ({
      main: '🎡 FAIS TOURNER LA ROUE !',
      subtitle: '🎁 GAGNE TON BONUS !',
      triesLabel: 'TES ESSAIS:'
    })
  },
  wheelSegments: {
    type: Array,
    default: () => [
      {
        text: 'Bonus\n de 100%',
        value: 'bonus_100',
        color: '#ffffff',
        displayText: 'BONUS DE 100%',
        icon: '🎉',
        isWinning: true
      },
      {
        text: '250 tours\n gratuits',
        value: 'free_spins_250_first',
        color: '#ffffff',
        displayText: '250 TOURS GRATUITS',
        icon: '🎰',
        isWinning: true
      },
      {
        text: 'Bonus\n de 125%',
        value: 'bonus_125_first',
        color: '#ffffff',
        displayText: 'BONUS DE 125%',
        icon: '🎁',
        isWinning: true
      },
      {
        text: 'Pas\n de  bonus',
        value: 'no_bonus_first',
        color: '#ffffff',
        displayText: 'PAS DE BONUS',
        icon: '😔',
        isWinning: false
      },
      {
        text: '250 tours\n gratuits',
        value: 'free_spins_250_middle',
        color: '#ffffff',
        displayText: '250 TOURS GRATUITS',
        icon: '🎰',
        isWinning: true
      },
      {
        text: 'Relancer\n le spin',
        value: 'respin_first',
        color: '#ffffff',
        displayText: 'RELANCER LE SPIN',
        icon: '🔄',
        isWinning: false
      },
      {
        text: 'Bonus\n de 125%',
        value: 'bonus_125_second',
        color: '#ffffff',
        displayText: 'BONUS DE 125%',
        icon: '💰',
        isWinning: true
      },
      {
        text: '250 tours\n gratuits',
        value: 'free_spins_250_last',
        color: '#ffffff',
        displayText: '250 TOURS GRATUITS',
        icon: '🎰',
        isWinning: true
      },
    ]
  },
  popupTexts: {
    type: Object,
    default: () => ({
      firstPopup: {
        congratulations: 'FÉLICITATIONS !',
        youWon: 'VOUS AVEZ GAGNÉ ',
        spinAgain: 'TOURNEZ À NOUVEAU !'
      },
      secondPopup: {
        yourWinnings: 'VOS GAINS',
        description: '',
        claimButton: 'RÉCLAMER TOUS LES BONUS'
      }
    })
  }
})

const emit = defineEmits(['spin-result', 'all-spins-completed', 'bonus-claimed'])

const segments = ref(props.wheelSegments)

useHead({
  meta: [
    { name: 'theme-color', content: () => props.colorScheme.primary }
  ]
})

const wheelRotation = ref(0)
const isSpinning = ref(false)
const spinCount = ref(0)
const remainingSpins = ref(props.maxSpins)
const showPopup = ref(false)
const popupType = ref('')
const lastPrize = ref('')
const lastPrizeSegment = ref(null)
const winningSegmentIndex = ref(-1)
const results = ref([])
const allWinnings = ref([])
const spinAudio = ref(null)
const winAudio1 = ref(null)
const winAudio2 = ref(null)

const getSegmentStyle = (index) => {
  const rotation = (360 / segments.value.length) * index
  return {
    transform: `rotate(${rotation}deg)`,
    backgroundColor: segments.value[index].color,
    borderColor: props.colorScheme.accent
  }
}

const getPlusPosition = (index) => {
  const positions = [
    { top: '10%', left: '15%' },
    { top: '20%', left: '85%' },
    { top: '30%', left: '10%' },
    { top: '40%', left: '90%' },
    { top: '50%', left: '5%' },
    { top: '60%', left: '95%' },
    { top: '70%', left: '10%' },
    { top: '80%', left: '85%' }
  ]
  const pos = positions[index % positions.length]
  return {
    top: pos.top,
    left: pos.left,
    animationDelay: `${index * 0.2}s`
  }
}

const getCoinPosition = (index) => {
  // Spread coins randomly across the entire screen
  const positions = [
    { left: '10%', top: '15%' },
    { left: '85%', top: '20%' },
    { left: '15%', top: '75%' },
    { left: '80%', top: '80%' },
    { left: '5%', top: '45%' },
    { left: '90%', top: '50%' },
    { left: '25%', top: '10%' },
    { left: '70%', top: '90%' },
    { left: '45%', top: '5%' },
    { left: '55%', top: '95%' },
    { left: '8%', top: '65%' },
    { left: '92%', top: '30%' }
  ]

  const position = positions[index % positions.length]

  return {
    left: position.left,
    top: position.top,
    animationDelay: `${index * 0.3}s`
  }
}

const getFireworkStyle = (index) => {
  const positions = [
    { top: '10%', left: '20%', animationDelay: '0s' },
    { top: '15%', right: '25%', animationDelay: '0.2s' },
    { top: '25%', left: '15%', animationDelay: '0.4s' },
    { top: '20%', right: '20%', animationDelay: '0.6s' },
    { top: '30%', left: '50%', animationDelay: '0.8s' }
  ]
  return positions[index % positions.length]
}

const getConfettiStyle = (index) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd']
  return {
    top: `${Math.random() * 20}%`,
    left: `${Math.random() * 100}%`,
    backgroundColor: colors[index % colors.length],
    animationDelay: `${index * 0.1}s`
  }
}

const spin = () => {
  if (isSpinning.value || remainingSpins.value === 0) return

  isSpinning.value = true
  remainingSpins.value--
  spinCount.value++

  // Play spinning sound
  if (spinAudio.value) {
    spinAudio.value.currentTime = 0
    spinAudio.value.play().catch(() => {
      // Audio play failed (browser autoplay policy)
    })
  }

  // NEW APPROACH: Choose winning segment first, then sync wheel position
  const segmentAngle = 360 / segments.value.length

  // Deterministic segment selection based on spin count
  let chosenSegmentIndex
  if (spinCount.value === 1) {
    // First spin: always segment 6
    chosenSegmentIndex = 6
  } else if (spinCount.value === 2) {
    // Second spin: always segment 7
    chosenSegmentIndex = 7
  }

  console.log(`🎯 Pre-selected segment: ${chosenSegmentIndex}, Text: "${segments.value[chosenSegmentIndex]?.text.replace('\n', ' ')}"`)

  // More gambling-style: longer spins with dramatic deceleration
  const baseSpins = 9 // 8-13 full rotations

  // Perfect stop angles calibrated for segments 6 and 7
  // Let's try different angles to find the perfect ones
  let targetAngle

  if (chosenSegmentIndex === 6) {
    // Perfect angle for segment 6 (270°)
    targetAngle = -325
  } else if (chosenSegmentIndex === 7) {
    // Perfect angle for segment 7 (315°)
    targetAngle = -3
  }

  // Set final rotation to land exactly on chosen segment (absolute positioning)
  const finalRotation = (360 * baseSpins) + targetAngle

  console.log(`🎲 Perfect angle for segment ${chosenSegmentIndex}: ${targetAngle}°`)

  wheelRotation.value = finalRotation

  setTimeout(() => {
    isSpinning.value = false

    // Stop spinning sound
    if (spinAudio.value) {
      spinAudio.value.pause()
      spinAudio.value.currentTime = 0
    }

    // Use the pre-chosen segment (wheel should be visually aligned with this)
    const actualSegmentIndex = chosenSegmentIndex
    const selectedSegment = segments.value[actualSegmentIndex]
    lastPrize.value = selectedSegment.displayText
    lastPrizeSegment.value = selectedSegment
    winningSegmentIndex.value = actualSegmentIndex
    results.value.push(selectedSegment)
    allWinnings.value.push(selectedSegment)

    // Debug logging
    console.log(`🎯 Chosen segment: ${actualSegmentIndex}`)
    console.log(`✅ Won segment ${actualSegmentIndex}: "${selectedSegment.text.replace('\n', ' ')}"`)
    console.log(`📢 Popup will show: "${selectedSegment.displayText}"`)

    // Play win sound based on spin count
    if (spinCount.value === 1 && winAudio1.value) {
      winAudio1.value.currentTime = 0
      winAudio1.value.play().catch(() => {
        // Audio play failed (browser autoplay policy)
      })
    } else if (spinCount.value === 2 && winAudio2.value) {
      winAudio2.value.currentTime = 0
      winAudio2.value.play().catch(() => {
        // Audio play failed (browser autoplay policy)
      })
    }

    // Dramatic win sound
    console.log('🎉 WIN SOUND!')

    emit('spin-result', {
      segment: selectedSegment,
      spinNumber: spinCount.value,
      remainingSpins: remainingSpins.value
    })

    // Delay popup for dramatic effect
    setTimeout(() => {
      if (spinCount.value === 1) {
        popupType.value = 'first'
        showPopup.value = true
      } else if (spinCount.value === 2) {
        popupType.value = 'second'
        showPopup.value = true
        emit('all-spins-completed', results.value)
      }
    }, 700) // 800ms delay for dramatic effect
  }, props.spinDuration)
}

const closePopup = () => {
  showPopup.value = false
  popupType.value = ''
}

const claimBonus = () => {
  emit('bonus-claimed', results.value)
  closePopup()
}

onMounted(() => {
  const coins = document.querySelectorAll('.coin')
  coins.forEach((coin, index) => {
    coin.style.animationDelay = `${index * 0.3}s`
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Bungee:wght@400&family=Orbitron:wght@400;700;900&display=swap');

.casino-wheel-container {
  position: relative;
  min-height: 100vh;
  background: v-bind('colorScheme.background');
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  color: white;
}

.casino-wheel-container.spinning {
  animation: backgroundPulse 0.5s ease-in-out infinite alternate;
}

.decorative-corners {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, v-bind('colorScheme.secondary'), v-bind('colorScheme.accent'));
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.corner-top-left {
  top: 0;
  left: 0;
}

.corner-top-right {
  top: 0;
  right: 0;
  transform: rotate(90deg);
}

.corner-bottom-left {
  bottom: 0;
  left: 0;
  transform: rotate(-90deg);
}

.corner-bottom-right {
  bottom: 0;
  right: 0;
  transform: rotate(180deg);
}

.plus-pattern .plus {
  position: absolute;
  color: white;
  font-size: 24px;
  font-weight: bold;
  opacity: 0.3;
  animation: twinkle 2s infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.3; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.2); }
}

.casino-branding {
  text-align: center;
  margin-bottom: 20px;
  z-index: 2;
  position: relative;
}

.casino-logo {
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
}

.logo-image {
  max-width: 171px;
  max-height: 80px;
  border-radius: 10px;
  padding: 10px;
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.casino-name {
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 2.5rem;
  font-weight: 900;
  color: v-bind('colorScheme.secondary');
  text-shadow:
    3px 3px 0px #000,
    -1px -1px 0px #000,
    1px -1px 0px #000,
    -1px 1px 0px #000,
    1px 1px 0px #000,
    4px 4px 8px rgba(0,0,0,0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: casinoNameGlow 3s ease-in-out infinite alternate;
}

@keyframes casinoNameGlow {
  0% {
    filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(249, 115, 22, 1));
  }
}

.header-text {
  text-align: center;
  margin-bottom: 30px;
  z-index: 2;
}

.header-text h1 {
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 10px;
  text-shadow:
    3px 3px 0px #000,
    -1px -1px 0px #000,
    1px -1px 0px #000,
    -1px 1px 0px #000,
    1px 1px 0px #000,
    4px 4px 8px rgba(255, 215, 0, 0.8);
  color: #fff;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: headerGlow 2s ease-in-out infinite alternate;
}

@keyframes headerGlow {
  0% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1));
  }
}

.header-text h2 {
  font-family: 'Fredoka One', 'Arial Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 700;
  color: v-bind('colorScheme.secondary');
  margin-bottom: 15px;
  text-shadow:
    2px 2px 0px #000,
    -1px -1px 0px #000,
    1px -1px 0px #000,
    -1px 1px 0px #000,
    1px 1px 0px #000,
    3px 3px 6px rgba(249, 115, 22, 0.8);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tries-counter {
  font-family: 'Orbitron', monospace;
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255, 215, 0, 0.3));
  padding: 12px 20px;
  border-radius: 25px;
  display: inline-block;
  border: 2px solid #ffd700;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  letter-spacing: 2px;
  animation: counterPulse 1.5s ease-in-out infinite;
}

@keyframes counterPulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
}

.floating-coins {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.coin {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  border-radius: 50%;
  border: 3px solid #b45309;
  animation: gamblingFloat 2.5s ease-in-out infinite;
  box-shadow:
    0 4px 8px rgba(0,0,0,0.3),
    0 0 20px rgba(255, 215, 0, 0.5),
    inset 0 2px 5px rgba(255,255,255,0.4);
}

.coin::before {
  content: '$';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #b45309;
  font-size: 18px;
}

@keyframes gamblingFloat {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
    box-shadow:
      0 4px 8px rgba(0,0,0,0.3),
      0 0 20px rgba(255, 215, 0, 0.5),
      inset 0 2px 5px rgba(255,255,255,0.4);
  }
  25% {
    transform: translateY(-15px) rotate(90deg) scale(1.1);
    box-shadow:
      0 8px 16px rgba(0,0,0,0.4),
      0 0 30px rgba(255, 215, 0, 0.8),
      inset 0 3px 8px rgba(255,255,255,0.6);
  }
  50% {
    transform: translateY(-30px) rotate(180deg) scale(1.2);
    box-shadow:
      0 12px 24px rgba(0,0,0,0.5),
      0 0 40px rgba(255, 215, 0, 1),
      0 0 60px rgba(255, 69, 0, 0.6),
      inset 0 4px 12px rgba(255,255,255,0.8);
  }
  75% {
    transform: translateY(-15px) rotate(270deg) scale(1.1);
    box-shadow:
      0 8px 16px rgba(0,0,0,0.4),
      0 0 30px rgba(255, 215, 0, 0.8),
      inset 0 3px 8px rgba(255,255,255,0.6);
  }
  100% {
    transform: translateY(0px) rotate(360deg) scale(1);
    box-shadow:
      0 4px 8px rgba(0,0,0,0.3),
      0 0 20px rgba(255, 215, 0, 0.5),
      inset 0 2px 5px rgba(255,255,255,0.4);
  }
}

.wheel-wrapper {
  position: relative;
  z-index: 3;
  margin: 40px 0;
}

.wheel-container {
  position: relative;
  width: 500px;
  height: 500px;
  margin: 0 auto;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid #b45309;
  box-shadow:
    0 0 30px rgba(180, 83, 9, 0.5),
    inset 0 0 20px rgba(0,0,0,0.3),
    0 0 60px rgba(255, 215, 0, 0.3);
  position: relative;
  transition: transform 6s cubic-bezier(0.23, 1, 0.32, 1);
  background: v-bind('wheelBackground');
  transform-origin: center center;
}

.wheel.spinning {
  transition: transform 6s cubic-bezier(0.23, 1, 0.32, 1);
  animation: wheelGlow 0.5s ease-in-out;
}

@keyframes wheelGlow {
  0% {
    box-shadow:
      0 0 30px rgba(180, 83, 9, 0.5),
      inset 0 0 20px rgba(0,0,0,0.3),
      0 0 60px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow:
      0 0 60px rgba(180, 83, 9, 0.8),
      inset 0 0 30px rgba(255,215,0,0.3),
      0 0 120px rgba(255, 215, 0, 0.8),
      0 0 200px rgba(255, 69, 0, 0.6);
  }
  100% {
    box-shadow:
      0 0 30px rgba(180, 83, 9, 0.5),
      inset 0 0 20px rgba(0,0,0,0.3),
      0 0 60px rgba(255, 215, 0, 0.3);
  }
}

@keyframes backgroundPulse {
  0% {
    filter: brightness(1) saturate(1);
  }
  100% {
    filter: brightness(1.1) saturate(1.2);
  }
}

.wrapper-spinning {
  animation: containerShake 0.1s ease-in-out infinite;
}

@keyframes containerShake {
  0%, 100% {
    transform: translateX(0px);
  }
  25% {
    transform: translateX(-1px);
  }
  75% {
    transform: translateX(1px);
  }
}

.coins-spinning .coin {
  animation: gamblingFloat 2.5s ease-in-out infinite, spinningCoinBoost 0.2s ease-in-out infinite;
}

@keyframes spinningCoinBoost {
  0%, 100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-5px) rotate(180deg) scale(1.1);
  }
}

.pointer-spinning {
  animation: pointerVibrate 0.1s ease-in-out infinite;
}

@keyframes pointerVibrate {
  0%, 100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(-2deg);
  }
  75% {
    transform: translateX(-50%) rotate(2deg);
  }
}

.mega-spin {
  filter: brightness(1.2) saturate(1.3);
}

.segment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  transform-origin: 0 0;
  z-index: 2;
}

.segment-content {
  position: absolute;
  left: 40%;
  top: -103px;
  width: 120px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: rotate(71.5deg);
}

.segment-text {
  font-family: 'Orbitron', 'Arial Black', sans-serif;
  font-size: 15px;
  font-weight: 900;
  color: white;
  text-shadow:
    1px 1px 0px #000,
    -0.5px -0.5px 0px #000,
    0.5px -0.5px 0px #000,
    -0.5px 0.5px 0px #000,
    0.5px 0.5px 0px #000,
    2px 2px 4px rgba(0,0,0,0.9);
  line-height: 1.1;
  margin-bottom: 3px;
  white-space: pre-line;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.star-decoration {
  font-size: 16px;
  color: #ffd700;
  text-shadow: 0 0 5px #ffd700;
}

.losing-decoration {
  font-size: 16px;
  color: #ff4444;
  text-shadow: 0 0 5px #ff4444;
  font-weight: bold;
}

.losing-segment {
  opacity: 0.7;
}

.spin-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #b45309;
  background: v-bind('colorScheme.secondary');
  color: white;
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  word-break: break-all;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.3);
  text-shadow:
    2px 2px 0px #000,
    -1px -1px 0px #000,
    1px -1px 0px #000,
    -1px 1px 0px #000,
    1px 1px 0px #000;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.spin-button:hover:not(:disabled) {
  transform: translate(-50%, -50%) scale(1.1);
  box-shadow:
    0 6px 20px rgba(249, 115, 22, 0.4),
    inset 0 2px 5px rgba(255,255,255,0.3),
    0 0 30px rgba(255, 215, 0, 0.6);
  animation: gamblingPulse 0.8s infinite alternate;
}

@keyframes gamblingPulse {
  0% {
    box-shadow:
      0 6px 20px rgba(249, 115, 22, 0.4),
      inset 0 2px 5px rgba(255,255,255,0.3),
      0 0 30px rgba(255, 215, 0, 0.6);
    transform: translate(-50%, -50%) scale(1.1);
  }
  50% {
    box-shadow:
      0 8px 30px rgba(249, 115, 22, 0.8),
      inset 0 4px 10px rgba(255,255,255,0.5),
      0 0 50px rgba(255, 215, 0, 1),
      0 0 80px rgba(255, 69, 0, 0.8);
    transform: translate(-50%, -50%) scale(1.15);
  }
  100% {
    box-shadow:
      0 10px 40px rgba(249, 115, 22, 1),
      inset 0 6px 15px rgba(255,255,255,0.7),
      0 0 70px rgba(255, 215, 0, 1.2),
      0 0 100px rgba(255, 69, 0, 1);
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Remove old pulse animation - replaced with gamblingPulse */

.wheel-pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #ffd700;
  z-index: 5;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.fixed-winner-indicator {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

.bottom-features {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  z-index: 2;
}

.feature-item {
  text-align: center;
  color: white;
  font-family: 'Fredoka One', 'Arial Black', sans-serif;
  font-weight: 900;
  font-size: 1rem;
  padding: 15px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.2);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  flex: 1;
  min-width: 200px;
  max-width: 250px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  animation: slideIn 0.3s ease;
}

.popup {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  color: #1e3a8a;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 450px;
  box-shadow:
    0 10px 30px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.8);
  border: 4px solid v-bind('colorScheme.accent');
  font-family: 'Orbitron', 'Arial Black', sans-serif;
}

.popup-header h2 {
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 20px;
  color: v-bind('colorScheme.primary');
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.prize-text {
  font-family: 'Fredoka One', 'Arial Black', sans-serif;
  font-size: 1.4rem;
  margin-bottom: 25px;
  font-weight: 900;
  color: v-bind('colorScheme.secondary');
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 1.3;
}

.popup-button {
  background: v-bind('colorScheme.secondary');
  color: white;
  border: none;
  padding: 18px 36px;
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 1.3rem;
  font-weight: 900;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.popup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Gambling-style popup animations */
.popup-fireworks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.firework {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ffd700, #ff6b6b, #4ecdc4);
  border-radius: 50%;
  animation: fireworkExplosion 1.5s ease-out infinite;
}

@keyframes fireworkExplosion {
  0% {
    transform: scale(0);
    opacity: 1;
    box-shadow: 0 0 0 0 #ffd700;
  }
  50% {
    transform: scale(1);
    opacity: 0.8;
    box-shadow: 0 0 30px 10px rgba(255, 215, 0, 0.8);
  }
  100% {
    transform: scale(2);
    opacity: 0;
    box-shadow: 0 0 60px 20px rgba(255, 215, 0, 0);
  }
}

.popup-confetti {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  animation: confettiFall 2s linear infinite;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(400px) rotate(360deg);
    opacity: 0;
  }
}

.celebration-text {
  animation: celebrationBounce 1s ease-in-out infinite;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

@keyframes celebrationBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.mega-win {
  background: linear-gradient(45deg, #ffd700, #ff6b6b, #4ecdc4, #ffd700);
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: celebrationBounce 0.8s ease-in-out infinite, rainbowText 2s ease-in-out infinite;
}

@keyframes rainbowText {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.pulsing-prize {
  animation: prizeGlow 1.5s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}

@keyframes prizeGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 1), 0 0 30px rgba(255, 69, 0, 0.8);
    transform: scale(1.05);
  }
}

.bonus-description {
  font-family: 'Fredoka One', 'Arial Black', sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #ffd700);
  background-size: 200% 200%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShimmer 2s ease-in-out infinite, rainbowText 3s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 25px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}

@keyframes textShimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.gambling-button {
  position: relative;
  overflow: hidden;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.gambling-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.6s ease;
}

.gambling-button:hover::before {
  left: 100%;
}

.gambling-button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 8px 25px rgba(249, 115, 22, 0.4),
    0 0 30px rgba(255, 215, 0, 0.6);
}

.claim-button {
  background: linear-gradient(45deg, #ff6b6b, #ffd700, #ff6b6b) !important;
  background-size: 200% 200%;
  animation: claimButtonGlow 1.5s ease-in-out infinite;
}

@keyframes claimButtonGlow {
  0%, 100% {
    background-position: 0% 50%;
    box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  }
  50% {
    background-position: 100% 50%;
    box-shadow: 0 6px 25px rgba(255, 107, 107, 0.6), 0 0 30px rgba(255, 215, 0, 0.8);
  }
}

/* Winning segment highlight */
.winning-segment {
  animation: winningGlow 2s ease-in-out infinite;
}

@keyframes winningGlow {
  0%, 100% {
    filter: brightness(1);
    box-shadow: none;
  }
  50% {
    filter: brightness(1.3);
    box-shadow:
      0 0 20px rgba(255, 215, 0, 0.8),
      inset 0 0 20px rgba(255, 215, 0, 0.3);
  }
}

.winning-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

.winner-badge {
  display: inline-block;
  font-size: 2rem;
  background: radial-gradient(circle, #ffd700, #ffed4e);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  border: 3px solid #b45309;
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.8),
    0 4px 15px rgba(0,0,0,0.3);
  animation: winnerPulse 1s ease-in-out infinite;
}

@keyframes winnerPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow:
      0 0 20px rgba(255, 215, 0, 0.8),
      0 4px 15px rgba(0,0,0,0.3);
  }
  50% {
    transform: scale(1.1);
    box-shadow:
      0 0 30px rgba(255, 215, 0, 1),
      0 6px 20px rgba(0,0,0,0.4);
  }
}

/* Popup winning display styles */
.winning-announcement {
  font-family: 'Bungee', 'Arial Black', sans-serif;
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e3a8a;
  margin-bottom: 15px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.all-winnings {
  background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(249,115,22,0.1));
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.winning-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
  animation: winningItemSlide 0.5s ease-out;
  animation-fill-mode: both;
}

.winning-item:last-child {
  border-bottom: none;
}

.winning-item:nth-child(1) { animation-delay: 0.1s; }
.winning-item:nth-child(2) { animation-delay: 0.2s; }
.winning-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes winningItemSlide {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.winning-icon {
  font-size: 2rem;
  margin-right: 15px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.winning-text {
  font-family: 'Fredoka One', 'Arial Black', sans-serif;
  font-size: 1.1rem;
  font-weight: 900;
  color: #1e3a8a;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  text-align: center;
  flex: 1;
}

@media (max-width: 768px) {
  .casino-wheel-container {
    padding: 10px;
  }

  .header-text h1 {
    font-size: 1.8rem;
  }

  .header-text h2 {
    font-size: 1.4rem;
  }

  .casino-name {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }

  .logo-image {
    max-width: 171px;
    max-height: 80px;
    padding: 6px;
  }

  .wheel-container {
    width: 300px;
    height: 300px;
  }

  .spin-button {
    width: 80px;
    height: 80px;
    font-size: 16px;
  }

  .segment-content {
    width: 100px;
    height: 70px;
    left: 33%;
    top: -78px;
  }

  .segment-text {
    font-size: 11px;
  }

  .bottom-features {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .feature-item {
    min-width: 280px;
    max-width: 320px;
  }

  .popup {
    margin: 20px;
    padding: 30px 20px;
  }

  .coin {
    width: 30px;
    height: 30px;
  }

  .coin::before {
    font-size: 14px;
  }
}
</style>
