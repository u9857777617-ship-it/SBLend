<template>
  <div class="fr-cases-landing" :style="rootStyle">
    <div v-if="showLoader" id="loader" class="loader" :style="loaderStyle">
      <div class="loader-logo">
        <img :src="logoImage" alt="Illiko Logo" decoding="async" fetchpriority="high">
      </div>
      <div class="loader-spinner"></div>
      <div class="loader-text">{{ props.texts.loader }}</div>
    </div>

    <div v-if="!showLoader && currentScreen === 3" id="screen3" class="screen active">
      <div class="background">
          <div class="chests-container">
          <div class="logo">
            <img :src="logoImage" alt="Illiko Logo">
          </div>
            <div class="chest-subtitle">
              <span>OUVRE ET TROUVE</span>
              <img :src="bonusImage" alt="777" class="small-777-icon">
              <br>
              <span>ET ACTIVE TON BONUS</span>
            </div>
          <div class="chests-panel">
          <div class="chests-grid" role="group" aria-label="Choisissez un coffre">
            <div v-for="(chest, index) in chests" :key="index" class="chest-wrap">
              <div v-if="chest.isOpened" class="chest-prize">
                <img
                  :src="chest.hasWinning ? bonusImage : reloadImage"
                  :alt="chest.hasWinning ? 'Bonus' : 'Reload'"
                  class="prize-img"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <button
                class="chest"
                :data-index="index"
                :aria-label="`Coffre ${index + 1}`"
                @click="openChest(index)"
                :disabled="chest.isOpened || gameStarted"
              >
                <img
                  class="chest-img"
                  :src="chest.isOpened ? chest.openedImage : chest.closedImage"
                  :alt="`Coffre ${chest.isOpened ? 'ouvert' : 'fermé'} ${index + 1}`"
                  decoding="async"
                  :fetchpriority="index < 2 ? 'high' : 'auto'"
                  loading="eager"
                >
              </button>
              <div
                class="chest-label"
                :class="{ disabled: chest.isOpened || gameStarted }"
                role="button"
                tabindex="0"
              >
                <img :src="openButtonImage" alt="OUVRIR" class="ouvrir-btn-img">
              </div>
            </div>
          </div>
          </div>

          <!-- Sponsor Banner -->
          <div class="sponsor-banner">
            <img :src="sponsorBannerImage" alt="Sponsor Banner" class="banner-img" loading="lazy" decoding="async">
          </div>
        </div>
      </div>
    </div>

    <div v-if="!showLoader && currentScreen === 4" id="screen4" class="screen active">
      <div class="background">
        <div class="bonus-container">
          <div class="logo">
            <img :src="logoImage" alt="Illiko Logo" loading="lazy" decoding="async">
          </div>

          <div class="final-bonus-card">
            <div class="final-bonus-image">
              <img :src="bonusImage" alt="Bonus Card" class="bonus-card-img" loading="lazy" decoding="async">
            </div>

            <div class="final-bonus-text">
              <span v-html="props.texts.bonusText"></span>
            </div>
          </div>

          <button class="bonus-btn" @click="claimBonus" :disabled="isLoading">
            <span>{{ isLoading ? props.texts.bonusLoading : props.texts.bonusButton }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { CSSProperties } from 'vue'

const props = defineProps({
  colorScheme: {
    type: Object,
    default: () => ({
      primary: '#1a237e',
      secondary: '#3949ab',
      accent: '#5c6bc0',
      background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)'
    })
  },
  texts: {
    type: Object,
    default: () => ({
      loader: 'CHARGEMENT...',
      subtitle: 'OUVRE ET TROUVE<br>ET ACTIVE TON BONUS',
      bonusText: 'VOS GAINS 150€<br>VIP 300FS<br>+150% FIRST DEP',
      bonusButton: 'OBTENIR',
      bonusLoading: 'CHARGEMENT...'
    })
  },
  offerUrl: {
    type: String,
    default: 'https://astro-muse.today/'
  },
  logoSrc: {
    type: String,
    default: () => new URL('../assets/fr-cases/image 1375.svg', import.meta.url).href
  }
})

interface Chest {
  isOpened: boolean
  closedImage: string
  openedImage: string
  hasWinning: boolean
}

const showLoader = ref(true)
const currentScreen = ref(3)
const isLoading = ref(false)
const gameStarted = ref(false)
const winningChestIndex = 1

const logoImage = computed(() => props.logoSrc)
const bonusImage = computed(() => new URL('../assets/fr-cases/bonus-billet.png', import.meta.url).href)
const openButtonImage = computed(() => new URL('../assets/fr-cases/ouvrir-btn.png', import.meta.url).href)
const sponsorBannerImage = computed(() => new URL('../assets/fr-cases/sponsors-banner.png', import.meta.url).href)
const backgroundImage = computed(() => new URL('../assets/fr-cases/background-banner-blue.png', import.meta.url).href)
const reloadImage = computed(() => new URL('../assets/fr-cases/reload.png', import.meta.url).href)

const rootStyle = computed<CSSProperties>(() => ({
  background: String(props.colorScheme.background),
  backgroundImage: `url(${backgroundImage.value})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}))

const loaderStyle = computed<CSSProperties>(() => ({
  background: String(props.colorScheme.background),
  backgroundImage: `url(${backgroundImage.value})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat'
}))


const chests = ref<Chest[]>([
  {
    isOpened: false,
    closedImage: new URL('../assets/fr-cases/case-closed-1.png', import.meta.url).href,
    openedImage: new URL('../assets/fr-cases/case-opened-1.png', import.meta.url).href,
    hasWinning: false
  },
  {
    isOpened: false,
    closedImage: new URL('../assets/fr-cases/case-closed-2.png', import.meta.url).href,
    openedImage: new URL('../assets/fr-cases/case-opened-2.png', import.meta.url).href,
    hasWinning: true
  },
  {
    isOpened: false,
    closedImage: new URL('../assets/fr-cases/case-closed-3.png', import.meta.url).href,
    openedImage: new URL('../assets/fr-cases/case-opened-3.png', import.meta.url).href,
    hasWinning: false
  }
])

const initializeApp = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000))

  showLoader.value = false
}

const openChest = (index: number): void => {
  if (gameStarted.value || chests.value[index].isOpened) return

  gameStarted.value = true

  chests.value[index].isOpened = true

  if (index === winningChestIndex) {
    setTimeout(() => {
      showScreen4()
    }, 1500)
    return
  }

  setTimeout(() => {
    gameStarted.value = false
  }, 800)
}

const showScreen4 = (): void => {
  currentScreen.value = 4

  setTimeout(() => {
    claimBonus()
  }, 2000)
}

const claimBonus = (): void => {
  isLoading.value = true

  const currentParams = window.location.search
  let offerUrl = props.offerUrl

  if (currentParams) {
    offerUrl += currentParams
  }

  try {
    window.location.href = offerUrl
  } catch (error) {
    console.error('Redirect error:', error)
    window.open(offerUrl, '_self')
  }
}

onMounted(() => {
  initializeApp()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Changa+One&family=Lilita+One&display=swap');
</style>

<style scoped>
.fr-cases-landing {
  position: relative;
  width: 100%;
  height: 100vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.loader-logo {
  margin-bottom: 30px;
  animation: logoPulse 2s ease-in-out infinite;
}

.loader-logo img {
  height: 100px;
  width: auto;
}

.loader-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loader-text {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  animation: textFade 1.5s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes textFade {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.screen.active {
  opacity: 1;
  visibility: visible;
}

.background {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.logo {
  margin-bottom: 20px;
  z-index: 10;
}

.logo img {
  height: 80px;
  width: auto;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.chests-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 900px;
  width: 90%;
}

.chest-subtitle {
  font-family: 'Lilita One', cursive;
  font-size: 28px;
  font-weight: 400;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  line-height: 1.2;
}

.small-777-icon {
  height: 34px;
  width: auto;
  max-width: 52px;
  vertical-align: middle;
  margin: 0 8px;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
  display: inline-block;
  object-fit: contain;
}

.chests-grid {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  gap: 20px;
  margin-bottom: 30px;
}

.chests-panel {
  width: 100%;
  padding: 14px 12px 10px;
  background: linear-gradient(180deg, #62D7FD 0%, #1C95FE 100%);
  border: 3px solid #ffffff;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25), 0 8px 24px rgba(0,0,0,0.25);
  max-width: 720px;
  margin: 0 auto;
}

.chests-panel .chests-grid {
  margin: 0;
  gap: 16px;
  justify-content: center;
}

.chest-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  width: 200px;
  min-height: auto;
}

.chest-prize {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.prize-img {
  width: 130px;
  height: auto;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  animation: prizeFloat 3s ease-in-out infinite;
}

@keyframes prizeFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.chest {
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.chest:hover:not(:disabled) {
  transform: scale(1.05);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
}

.chest:disabled {
  cursor: default;
}

.chest-img {
  width: 180px;
  height: auto;
  display: block;
  transition: all 0.5s ease;
}

.chest-label {
  margin-top: 6px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ouvrir-btn-img {
  width: 100px;
  height: auto;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chest-label.disabled .ouvrir-btn-img {
  opacity: 0.6;
  filter: grayscale(20%);
  cursor: default;
}

.ouvrir-btn-img:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.sponsor-banner {
  margin-top: 20px;
  max-width: 720px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 1024px) {
  .sponsor-banner {
    display: flex;
    justify-content: center;
  }
  .sponsor-banner .banner-img {
    display: block;
    margin: 0 auto;
  }
  .chest-subtitle {
    font-size: 56px;
  }
  .small-777-icon {
    height: 68px;
    max-width: 104px;
  }
}

.banner-img {
  max-width: 100%;
  height: auto;
}

.bonus-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 100%;
  width: 100%;
  padding: 0 16px;
}

.final-bonus-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 560px;
}

.final-bonus-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.bonus-card-img {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
  animation: imageGlow 3s ease-in-out infinite alternate;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

@keyframes imageGlow {
  0% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.6));
  }
  100% {
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.8));
  }
}

.final-bonus-text {
  font-family: 'Changa One', cursive;
  font-weight: 400;
  font-size: 52px;
  line-height: 100%;
  text-align: center;
  background: linear-gradient(135deg, #FFD700 0%, #FFA000 50%, #FF8F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
  margin: 0;
  animation: goldGlow 2s ease-in-out infinite alternate;
  -webkit-text-stroke: 2px rgba(0,0,0,0.85);
  text-shadow:
    0 1px 0 rgba(0,0,0,0.7),
    1px 0 0 rgba(0,0,0,0.7),
    0 -1px 0 rgba(0,0,0,0.7),
    -1px 0 0 rgba(0,0,0,0.7),
    0 0 30px rgba(255, 215, 0, 0.8);
}

@keyframes goldGlow {
  0% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
  }
  100% {
    text-shadow: 0 0 40px rgba(255, 215, 0, 1);
    filter: drop-shadow(0 6px 12px rgba(255, 215, 0, 0.5));
  }
}

.bonus-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border: 3px solid #333;
  border-radius: 50px;
  padding: 15px 30px;
  font-size: 24px;
  font-weight: bold;
  font-family: 'Changa One', cursive;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  margin: 0 auto;
}

.bonus-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.4);
}

.bonus-btn:active {
  transform: translateY(-1px);
}

.bonus-btn:disabled {
  opacity: 0.7;
  pointer-events: none;
}

@media (max-width: 768px) {
  .chests-panel {
    padding: 12px 10px;
    border-width: 2px;
  }
  .chests-panel .chests-grid {
    gap: 12px;
  }
  .chest-subtitle {
    font-size: 34px;
    line-height: 1.15;
  }

  .background {
    justify-content: flex-start;
    padding-top: 40px;
  }

  .final-bonus-text {
    font-size: 40px;
  }

  .bonus-btn {
    padding: 14px 28px;
    font-size: 18px;
  }

  .logo img {
    height: 75px;
  }

  .chest-img {
    width: 140px;
  }

  .prize-img {
    width: 110px;
  }

  .ouvrir-btn-img {
    width: 80px;
  }

  .small-777-icon {
    height: 48px;
    max-width: 72px;
  }

  .chests-grid {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .chests-panel {
    padding: 10px 8px;
    border-width: 2px;
  }
  .chests-panel .chests-grid {
    gap: 10px;
  }
  .chest-subtitle {
    font-size: 30px;
    line-height: 1.15;
  }

  .background {
    justify-content: flex-start;
    padding-top: 28px;
  }

  .final-bonus-text {
    font-size: 36px;
  }

  .chest-img {
    width: 120px;
  }

  .prize-img {
    width: 86px;
  }

  .ouvrir-btn-img {
    width: 70px;
  }

  .small-777-icon {
    height: 44px;
    max-width: 66px;
  }

  .chests-grid {
    gap: 10px;
  }
}
</style>
