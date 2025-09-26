<template>
  <div class="fr-scratch-landing">
    <div v-if="showLoader" id="loader" class="loader">
      <div class="loader-logo">
        <img
          :src="logoImage"
          alt="Illiko Logo"
          decoding="async"
          fetchpriority="high"
        />
      </div>
      <div class="loader-spinner"></div>
      <div class="loader-text">{{ props.texts.loader }}</div>
    </div>

    <div
      v-if="!showLoader && currentScreen === 3"
      id="screen3"
      class="screen active"
    >
      <div class="background">
        <div class="scratch-container">
          <div class="logo">
            <img :src="logoImage" alt="Illiko Logo" />
          </div>

          <div class="scratch-frame">
            <img
              :src="frameImage"
              alt="Scratch Frame"
              class="frame-bg"
              decoding="async"
              fetchpriority="high"
              width="350"
              height="auto"
            />

            <div class="scratch-cards">
              <div class="scratch-content">
                <div class="card-header">
                  <div class="title" v-html="props.texts.scratchTitle"></div>
                </div>
                <div class="scratch-areas">
                  <div
                    v-for="(area, index) in scratchAreas"
                    :key="index"
                    class="scratch-area-wrapper"
                  >
                    <div
                      class="scratch-area"
                      :data-area="index + 1"
                      :class="{ winning: index === 1 && area.isScratched }"
                    >
                      <canvas
                        :ref="(el: HTMLCanvasElement | null) => { if (el) canvasRefs[`scratchCanvas${index}`] = el }"
                        class="scratch-canvas"
                        width="200"
                        height="60"
                        @mousedown="startScratching($event, index)"
                        @mousemove="doScratching($event, index)"
                        @mouseup="stopScratching"
                        @mouseout="stopScratching"
                        @touchstart="startScratching($event, index)"
                        @touchmove="doScratching($event, index)"
                        @touchend="stopScratching"
                        @touchcancel="stopScratching"
                      ></canvas>
                      <div class="dice-content">
                        <div class="dice-row">
                          <img
                            v-for="(dice, diceIndex) in area.dices"
                            :key="diceIndex"
                            :src="dice.image"
                            :alt="dice.alt"
                            class="dice-img"
                            :class="{ winning: dice.isWinning }"
                            decoding="async"
                            width="50"
                            height="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button class="scratch-btn" @click="scratchCards">
            <span>{{ props.texts.scratchButton }}</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!showLoader && currentScreen === 4"
      id="screen4"
      class="screen active"
    >
      <div class="background">
        <div class="bonus-container">
          <div class="logo">
            <img
              :src="logoImage"
              alt="Illiko Logo"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="final-bonus-card">
            <div class="final-bonus-image">
              <img
                :src="bonusCardImage"
                alt="Bonus Card"
                class="bonus-card-img"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="final-bonus-text">
              <span v-html="props.texts.bonusText"></span>
            </div>
          </div>

          <button class="bonus-btn" @click="claimBonus" :disabled="isLoading">
            <span>{{
              isLoading ? props.texts.bonusLoading : props.texts.bonusButton
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";

const props = defineProps({
  colorScheme: {
    type: Object,
    default: () => ({
      primary: "#1a237e",
      secondary: "#3949ab",
      accent: "#5c6bc0",
      background:
        "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
    }),
  },
  texts: {
    type: Object,
    default: () => ({
      loader: "CHARGEMENT...",
      scratchTitle: "GRATTE ET<br>GAGNE",
      scratchButton: "GRATTE",
      bonusText: "VOS GAINS 150€<br>VIP 300FS<br>+150% FIRST DEP",
      bonusButton: "OBTENIR",
      bonusLoading: "CHARGEMENT...",
    }),
  },
  offerUrl: {
    type: String,
    default: "https://astro-muse.today/",
  },
  logoSrc: {
    type: String,
    default: () =>
      new URL("../assets/fr-scratch/image 1375.svg", import.meta.url).href,
  },
});

const showLoader = ref(true);
const currentScreen = ref(3);
const isLoading = ref(false);
const scratchProgress = ref<{ [key: string]: number }>({});
const isScratching = ref(false);
const canvasRefs = ref<{ [key: string]: HTMLCanvasElement }>({});
const lastPosition = ref<{ [key: string]: { x: number; y: number } }>({});

const logoImage = computed(() => props.logoSrc);
const frameImage = computed(
  () => new URL("../assets/fr-scratch/Frame 20652 1.svg", import.meta.url).href
);
const bonusCardImage = computed(
  () => new URL("../assets/fr-scratch/image 1642.svg", import.meta.url).href
);
const xImage = computed(
  () => new URL("../assets/fr-scratch/image 1393.png", import.meta.url).href
);
const sevenImage = computed(
  () => new URL("../assets/fr-scratch/image 1397.png", import.meta.url).href
);

const scratchAreas = ref([
  {
    isScratched: false,
    dices: [
      { image: xImage.value, alt: "X", isWinning: false },
      { image: sevenImage.value, alt: "7", isWinning: false },
      { image: xImage.value, alt: "X", isWinning: false },
    ],
  },
  {
    isScratched: false,
    dices: [
      { image: sevenImage.value, alt: "7", isWinning: true },
      { image: sevenImage.value, alt: "7", isWinning: true },
      { image: sevenImage.value, alt: "7", isWinning: true },
    ],
  },
  {
    isScratched: false,
    dices: [
      { image: xImage.value, alt: "X", isWinning: false },
      { image: xImage.value, alt: "X", isWinning: false },
      { image: sevenImage.value, alt: "7", isWinning: false },
    ],
  },
]);

const redirectToOffer = () => {
  const currentParams = window.location.search;
  window.location.href = offerUrl + currentParams;
};

let redirectTimeout;

const startRedirectTimer = () => {
  redirectTimeout = setTimeout(() => {
    redirectToOffer();
  }, 4000);
};

const cancelRedirectTimer = () => {
  clearTimeout(redirectTimeout);
};

const initializeApp = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  showLoader.value = false;

  nextTick(() => {
    initializeScratchCards();
  });
};

const initializeScratchCards = (): void => {
  scratchAreas.value.forEach((area, index) => {
    const canvasKey = `scratchCanvas${index}`;
    const canvas = canvasRefs.value[canvasKey];

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#6c757d";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "#8e8e93";
        for (let i = 0; i < 50; i++) {
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            2,
            2
          );
        }
        ctx.globalCompositeOperation = "source-over";

        scratchProgress.value[`screen3_${index + 1}`] = 0;
      }
    } else {
      setTimeout(() => {
        const canvas = canvasRefs.value[canvasKey];
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "#6c757d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.globalCompositeOperation = "source-atop";
            ctx.fillStyle = "#8e8e93";
            for (let i = 0; i < 50; i++) {
              ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                2,
                2
              );
            }
            ctx.globalCompositeOperation = "source-over";

            scratchProgress.value[`screen3_${index + 1}`] = 0;
          }
        }
      }, 100);
    }
  });
};

const startScratching = (e: MouseEvent | TouchEvent, index: number): void => {
  e.preventDefault();
  isScratching.value = true;

  const canvasKey = `scratchCanvas${index}`;
  const canvas = canvasRefs.value[canvasKey];

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const touch = "touches" in e ? e.touches[0] : e;
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      lastPosition.value[canvasKey] = { x, y };

      scratch(ctx, x, y);
      updateScratchProgress(ctx, canvas, index);
    }
  }
};

const doScratching = (e: MouseEvent | TouchEvent, index: number): void => {
  if (!isScratching.value) return;

  e.preventDefault();

  const canvasKey = `scratchCanvas${index}`;
  const canvas = canvasRefs.value[canvasKey];

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const touch = "touches" in e ? e.touches[0] : e;
      const currentX = touch.clientX - rect.left;
      const currentY = touch.clientY - rect.top;

      const lastPos = lastPosition.value[canvasKey];
      if (lastPos) {
        drawScratchLine(ctx, lastPos.x, lastPos.y, currentX, currentY);
        lastPosition.value[canvasKey] = { x: currentX, y: currentY };
      } else {
        scratch(ctx, currentX, currentY);
        lastPosition.value[canvasKey] = { x: currentX, y: currentY };
      }

      updateScratchProgress(ctx, canvas, index);
    }
  }
};

const stopScratching = (): void => {
  isScratching.value = false;
};

const scratch = (ctx: CanvasRenderingContext2D, x: number, y: number): void => {
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
};

const drawScratchLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): void => {
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineWidth = 50;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
};

const updateScratchProgress = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  index: number
): void => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparentPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparentPixels++;
    }
  }

  const progressKey = `screen3_${index + 1}`;
  scratchProgress.value[progressKey] =
    (transparentPixels / (pixels.length / 4)) * 100;

  if (scratchProgress.value[progressKey] > 60) {
    scratchAreas.value[index].isScratched = true;

    const canvasKey = `scratchCanvas${index}`;
    const canvasElement = canvasRefs.value[canvasKey];
    if (canvasElement) {
      canvasElement.style.display = "none";
    }

    if (index === 1) {
      revealAllOtherLines();
      return;
    }

    const scratchedAreas = scratchAreas.value.filter(
      (area) => area.isScratched
    ).length;
    if (scratchedAreas >= 3) {
      setTimeout(() => {
        showScreen4();
      }, 3000);
    }
  }
};

const revealAllOtherLines = (): void => {
  scratchAreas.value.forEach((area, index) => {
    if (index !== 1 && !area.isScratched) {
      setTimeout(() => {
        area.isScratched = true;

        const canvasKey = `scratchCanvas${index}`;
        const canvasElement = canvasRefs.value[canvasKey];
        if (canvasElement) {
          canvasElement.style.transition = "opacity 0.8s ease-out";
          canvasElement.style.opacity = "0";

          setTimeout(() => {
            canvasElement.style.display = "none";
          }, 800);
        }
      }, index * 200);
    }
  });

  setTimeout(() => {
    showScreen4();
  }, 2500);
};

const scratchCards = (): void => {
  scratchAreas.value.forEach((area, index) => {
    setTimeout(() => {
      area.isScratched = true;

      const canvasKey = `scratchCanvas${index}`;
      const canvas = canvasRefs.value[canvasKey];
      if (canvas) {
        canvas.style.transition = "opacity 1s ease-out";
        canvas.style.opacity = "0";

        setTimeout(() => {
          canvas.style.display = "none";
        }, 1000);
      }
    }, index * 300);
  });

  setTimeout(() => {
    showScreen4();
  }, 3500);
};

const showScreen4 = (): void => {
  currentScreen.value = 4;

  setTimeout(() => {
    claimBonus();
  }, 2000);
};

const claimBonus = (): void => {
  isLoading.value = true;
  cancelRedirectTimer();

  const currentParams = window.location.search;
  let offerUrl = props.offerUrl;

  if (currentParams) {
    offerUrl += currentParams;
  }

  try {
    window.location.href = offerUrl;
  } catch (error) {
    console.error("Redirect error:", error);
    window.open(offerUrl, "_self");
  }
};

onMounted(() => {
  startRedirectTimer();
  initializeApp();
});
</script>

<style scoped>
.fr-scratch-landing {
  position: relative;
  width: 100%;
  height: 100vh;
  background: v-bind("props.colorScheme.background");
  overflow: hidden;
  font-family: "Arial", sans-serif;
}

.fr-scratch-landing::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
      circle at 20% 20%,
      rgba(255, 255, 255, 0.1) 2px,
      transparent 2px
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.1) 2px,
      transparent 2px
    );
  background-size: 50px 50px, 70px 70px;
  z-index: 0;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: v-bind("props.colorScheme.background");
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
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes textFade {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
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

.scratch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 400px;
  width: 90%;
}

.scratch-frame {
  position: relative;
  width: 100%;
  max-width: 350px;
}

.frame-bg {
  width: 100%;
  height: auto;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.scratch-cards {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
}

.scratch-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: transparent;
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-bottom: 10px;
}

.title {
  font-family: "Changa One", cursive;
  font-weight: 400;
  font-size: 44px;
  line-height: 100%;
  text-align: right;
  color: #212529;
  margin: 0;
}

.scratch-areas {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 10px 0 20px 0;
}

.scratch-area-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.scratch-area {
  background: #6c757d;
  border-radius: 8px;
  height: 60px;
  position: relative;
  overflow: hidden;
}

.scratch-area.winning {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%) !important;
  border: 2px solid #ff8f00 !important;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5) !important;
  animation: winningPulse 1.5s ease-in-out infinite;
}

@keyframes winningPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
    transform: scale(1.02);
  }
}

.scratch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  cursor: crosshair;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
}

.dice-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
}

.dice-row {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding: 0 10px;
  gap: 10px;
}

.dice-img {
  width: 50px;
  height: 50px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  display: block;
  object-fit: contain;
  flex-shrink: 0;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.dice-img.winning {
  animation: diceWinning 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
}

@keyframes diceWinning {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  }
  25% {
    transform: scale(1.1) rotate(-2deg);
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
  }
  75% {
    transform: scale(1.1) rotate(2deg);
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
  }
}

.scratch-btn {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  border: 3px solid #333;
  border-radius: 50px;
  padding: 15px 30px;
  font-size: 24px;
  font-weight: bold;
  font-family: "Changa One", cursive;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}

.scratch-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.scratch-btn:active {
  transform: translateY(-1px);
}

.bonus-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  max-width: 400px;
  width: 90%;
}

.final-bonus-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 100%;
  max-width: 400px;
}

.final-bonus-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.bonus-card-img {
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
  font-family: "Changa One", cursive;
  font-weight: 400;
  font-size: 52px;
  line-height: 100%;
  text-align: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffa000 50%, #ff8f00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
  margin: 0;
  animation: goldGlow 2s ease-in-out infinite alternate;
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
  font-family: "Changa One", cursive;
  color: #333;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}

.bonus-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.bonus-btn:active {
  transform: translateY(-1px);
}

.bonus-btn:disabled {
  opacity: 0.7;
  pointer-events: none;
}

@media (max-width: 768px) {
  .title {
    font-size: 32px;
  }

  .final-bonus-text {
    font-size: 36px;
  }

  .scratch-btn,
  .bonus-btn {
    padding: 12px 25px;
    font-size: 16px;
  }

  .dice-img {
    width: 45px;
    height: 45px;
  }

  .logo img {
    height: 75px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 28px;
  }

  .final-bonus-text {
    font-size: 38px;
  }

  .dice-img {
    width: 40px;
    height: 40px;
  }

  .scratch-content {
    padding: 15px;
  }
}
</style>
