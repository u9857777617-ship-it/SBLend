<template>
  <div class="scratch-cards-game" :style="rootStyle">
    <div v-if="showLoader" class="loader">
      <div class="loader-logo">
        <img
          :src="logoImage"
          alt="Game Logo"
          decoding="async"
          fetchpriority="high"
        />
      </div>
      <div class="loader-spinner"></div>
      <div class="loader-text">{{ props.texts.loader }}</div>
    </div>

    <div v-if="!showLoader && !gameCompleted" class="game-screen">
      <div class="game-header">
        <div class="logo">
          <img :src="logoImage" alt="Game Logo" />
        </div>
        <h1 class="game-title">{{ props.texts.gameTitle }}</h1>
        <div class="game-subtitle">{{ props.texts.gameSubtitle }}</div>
        <div class="progress-info">
          <div class="cards-counter">
            {{ props.texts.cardsScratched }}: {{ scratchedCards }}/{{
              totalCards
            }}
          </div>
          <div class="wins-counter">
            {{ props.texts.winsFound }}: {{ winsFound }}
          </div>
        </div>
      </div>

      <div class="cards-container">
        <div class="cards-grid">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="card-wrapper"
            :class="{ 'card-winning': card.isWinning && card.isScratched }"
          >
            <div class="card" @click="scratchCard(index)">
              <!-- Scratch overlay -->
              <canvas
                v-if="!card.isScratched"
                :ref="(el: HTMLCanvasElement | null) => { if (el) canvasRefs[`card_${index}`] = el }"
                class="scratch-canvas"
                width="200"
                height="150"
                @mousedown="startScratching($event, index)"
                @mousemove="doScratching($event, index)"
                @mouseup="stopScratching"
                @mouseout="stopScratching"
                @touchstart="startScratching($event, index)"
                @touchmove="doScratching($event, index)"
                @touchend="stopScratching"
                @touchcancel="stopScratching"
              ></canvas>

              <!-- Card content (revealed after scratching) -->
              <div class="card-content" :class="{ revealed: card.isScratched }">
                <div class="card-icon">{{ card.icon }}</div>
                <div class="card-text">{{ card.text }}</div>
                <div v-if="card.isWinning" class="win-indicator">🎉</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="game-controls">
        <button
          class="scratch-all-btn"
          @click="scratchAllCards"
          :disabled="allScratched"
        >
          {{ props.texts.scratchAllButton }}
        </button>
      </div>
    </div>

    <!-- Game completed screen -->
    <div v-if="gameCompleted" class="completion-screen">
      <div class="completion-content">
        <div class="logo">
          <img :src="logoImage" alt="Game Logo" />
        </div>

        <h2 class="completion-title">{{ props.texts.gameCompleted }}</h2>

        <div class="results-summary">
          <div class="result-item">
            <span class="result-icon">🎴</span>
            <span class="result-text"
              >{{ props.texts.totalScratched }}: {{ scratchedCards }}</span
            >
          </div>
          <div class="result-item">
            <span class="result-icon">🏆</span>
            <span class="result-text"
              >{{ props.texts.totalWins }}: {{ winsFound }}</span
            >
          </div>
        </div>

        <div class="winning-items">
          <h3>{{ props.texts.yourPrizes }}</h3>
          <div class="prizes-grid">
            <div
              v-for="(prize, index) in winningPrizes"
              :key="index"
              class="prize-item"
            >
              <span class="prize-icon">{{ prize.icon }}</span>
              <span class="prize-text">{{ prize.text }}</span>
            </div>
          </div>
        </div>

        <button
          class="claim-prizes-btn"
          @click="claimPrizes"
          :disabled="isLoading"
        >
          <span>{{
            isLoading ? props.texts.claimLoading : props.texts.claimButton
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from "vue";
import type { CSSProperties } from "vue";

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
      loader: "ЗАГРУЗКА...",
      gameTitle: "СТИРАЙ И ВЫИГРЫВАЙ",
      gameSubtitle: "Сотри все карточки и найди свои призы!",
      cardsScratched: "Стерто",
      winsFound: "Выигрышей",
      scratchAllButton: "СТЕРЕТЬ ВСЕ",
      gameCompleted: "ИГРА ЗАВЕРШЕНА!",
      totalScratched: "Всего стерто",
      totalWins: "Всего выигрышей",
      yourPrizes: "ВАШИ ПРИЗЫ",
      claimButton: "ЗАБРАТЬ ПРИЗЫ",
      claimLoading: "ЗАГРУЗКА...",
    }),
  },
  offerUrl: {
    type: String,
    default: "https://example.com",
  },
  logoSrc: {
    type: String,
    default: () => new URL("../assets/fdjLogo.png", import.meta.url).href,
  },
});

interface Card {
  id: number;
  isScratched: boolean;
  isWinning: boolean;
  icon: string;
  text: string;
  prizeType: string;
}

const showLoader = ref(true);
const gameCompleted = ref(false);
const isLoading = ref(false);
const scratchedCards = ref(0);
const winsFound = ref(0);
const totalCards = 15;
const isScratching = ref(false);
const canvasRefs = ref<{ [key: string]: HTMLCanvasElement }>({});
const lastPosition = ref<{ [key: string]: { x: number; y: number } }>({});
const scratchProgress = ref<{ [key: string]: number }>({});

const rootStyle = computed<CSSProperties>(() => ({
  background: String(props.colorScheme.background),
}));

const logoImage = computed(() => props.logoSrc);

const allScratched = computed(() => scratchedCards.value === totalCards);

// Generate 15 cards with different prizes
const cards = ref<Card[]>([
  // Winning cards (6 out of 15)
  {
    id: 1,
    isScratched: false,
    isWinning: true,
    icon: "💎",
    text: "БОНУС 200%",
    prizeType: "bonus_200",
  },
  {
    id: 2,
    isScratched: false,
    isWinning: true,
    icon: "🎰",
    text: "500 FS",
    prizeType: "free_spins_500",
  },
  {
    id: 3,
    isScratched: false,
    isWinning: true,
    icon: "💰",
    text: "КЭШБЕК 50%",
    prizeType: "cashback_50",
  },
  {
    id: 4,
    isScratched: false,
    isWinning: true,
    icon: "🏆",
    text: "VIP СТАТУС",
    prizeType: "vip_status",
  },
  {
    id: 5,
    isScratched: false,
    isWinning: true,
    icon: "🎁",
    text: "БОНУС 150%",
    prizeType: "bonus_150",
  },
  {
    id: 6,
    isScratched: false,
    isWinning: true,
    icon: "💸",
    text: "1000 МОНЕТ",
    prizeType: "coins_1000",
  },

  // Non-winning cards (9 out of 15)
  {
    id: 7,
    isScratched: false,
    isWinning: false,
    icon: "❌",
    text: "ПУСТО",
    prizeType: "empty",
  },
  {
    id: 8,
    isScratched: false,
    isWinning: false,
    icon: "😔",
    text: "НЕУДАЧА",
    prizeType: "empty",
  },
  {
    id: 9,
    isScratched: false,
    isWinning: false,
    icon: "💔",
    text: "ПОПРОБУЙ ЕЩЕ",
    prizeType: "empty",
  },
  {
    id: 10,
    isScratched: false,
    isWinning: false,
    icon: "🚫",
    text: "НЕТ ПРИЗА",
    prizeType: "empty",
  },
  {
    id: 11,
    isScratched: false,
    isWinning: false,
    icon: "😞",
    text: "МИМО",
    prizeType: "empty",
  },
  {
    id: 12,
    isScratched: false,
    isWinning: false,
    icon: "💨",
    text: "ПУСТО",
    prizeType: "empty",
  },
  {
    id: 13,
    isScratched: false,
    isWinning: false,
    icon: "⚠️",
    text: "НЕУДАЧА",
    prizeType: "empty",
  },
  {
    id: 14,
    isScratched: false,
    isWinning: false,
    icon: "🙅",
    text: "НЕТ ПРИЗА",
    prizeType: "empty",
  },
  {
    id: 15,
    isScratched: false,
    isWinning: false,
    icon: "❗",
    text: "МИМО",
    prizeType: "empty",
  },
]);

const winningPrizes = computed(() => {
  return cards.value.filter((card) => card.isWinning && card.isScratched);
});

const emit = defineEmits(["game-completed", "prizes-claimed"]);

const initializeApp = async (): Promise<void> => {
  // Shuffle cards for random positioning
  shuffleArray(cards.value);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  showLoader.value = false;

  nextTick(() => {
    initializeScratchCards();
  });
};

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const initializeScratchCards = (): void => {
  cards.value.forEach((card, index) => {
    const canvasKey = `card_${index}`;
    const canvas = canvasRefs.value[canvasKey];

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill with scratch-off surface
        ctx.fillStyle = "#C0C0C0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add texture
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = "#A0A0A0";
        for (let i = 0; i < 100; i++) {
          ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            3,
            3
          );
        }
        ctx.globalCompositeOperation = "source-over";

        // Add "SCRATCH" text
        ctx.fillStyle = "#808080";
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("СТЕРЕТЬ", canvas.width / 2, canvas.height / 2);

        scratchProgress.value[canvasKey] = 0;
      }
    }
  });
};

const startScratching = (e: MouseEvent | TouchEvent, index: number): void => {
  e.preventDefault();
  isScratching.value = true;

  const canvasKey = `card_${index}`;
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

  const canvasKey = `card_${index}`;
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
  ctx.arc(x, y, 20, 0, 2 * Math.PI);
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
  ctx.lineWidth = 40;
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

  const canvasKey = `card_${index}`;
  scratchProgress.value[canvasKey] =
    (transparentPixels / (pixels.length / 4)) * 100;

  if (
    scratchProgress.value[canvasKey] > 50 &&
    !cards.value[index].isScratched
  ) {
    scratchCard(index);
  }
};

const scratchCard = (index: number): void => {
  if (cards.value[index].isScratched) return;

  cards.value[index].isScratched = true;
  scratchedCards.value++;

  if (cards.value[index].isWinning) {
    winsFound.value++;
  }

  // Hide canvas
  const canvasKey = `card_${index}`;
  const canvas = canvasRefs.value[canvasKey];
  if (canvas) {
    canvas.style.transition = "opacity 0.5s ease-out";
    canvas.style.opacity = "0";
    setTimeout(() => {
      canvas.style.display = "none";
    }, 500);
  }

  // Check if game is completed
  if (scratchedCards.value === totalCards) {
    setTimeout(() => {
      gameCompleted.value = true;
      emit("game-completed", winningPrizes.value);
    }, 1000);
  }
};

const scratchAllCards = (): void => {
  cards.value.forEach((card, index) => {
    if (!card.isScratched) {
      setTimeout(() => {
        scratchCard(index);
      }, index * 100);
    }
  });
};

const claimPrizes = (): void => {
  isLoading.value = true;

  const currentParams = window.location.search;
  let offerUrl = props.offerUrl;

  if (currentParams) {
    offerUrl += currentParams;
  }

  emit("prizes-claimed", winningPrizes.value);

  setTimeout(() => {
    try {
      window.location.href = offerUrl;
    } catch (error) {
      console.error("Redirect error:", error);
      window.open(offerUrl, "_self");
    }
  }, 1000);
};

onMounted(() => {
  initializeApp();
});
</script>

<style scoped>
.scratch-cards-game {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
  font-family: "Arial", sans-serif;
  color: white;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: v-bind("colorScheme.background");
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

.game-screen {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  margin-bottom: 20px;
}

.logo img {
  height: 80px;
  width: auto;
}

.game-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #ffd700, #ffa000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.game-subtitle {
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.progress-info {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.cards-counter,
.wins-counter {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  backdrop-filter: blur(5px);
}

.cards-container {
  flex: 1;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  max-width: 1200px;
  width: 100%;
}

.card-wrapper {
  position: relative;
  transition: transform 0.3s ease;
}

.card-wrapper:hover {
  transform: scale(1.05);
}

.card-wrapper.card-winning {
  animation: winningGlow 2s ease-in-out infinite;
}

@keyframes winningGlow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }
}

.card {
  position: relative;
  width: 200px;
  height: 150px;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  border: 3px solid #ddd;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #ffd700;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.scratch-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

.card-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #333;
  text-align: center;
  transition: all 0.5s ease;
  z-index: 1;
}

.card-content.revealed {
  z-index: 20;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.card-text {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
}

.win-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 1.5rem;
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.game-controls {
  text-align: center;
}

.scratch-all-btn {
  background: linear-gradient(135deg, #ffd700, #ffa000);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.scratch-all-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.4);
}

.scratch-all-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.completion-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.completion-content {
  text-align: center;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.completion-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #ffd700, #ffa000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

@keyframes titleGlow {
  0% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
  100% {
    text-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
  }
}

.results-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: bold;
}

.result-icon {
  font-size: 1.5rem;
}

.winning-items h3 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #ffd700;
}

.prizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.prize-item {
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.prize-icon {
  font-size: 1.8rem;
}

.prize-text {
  font-weight: bold;
  text-transform: uppercase;
}

.claim-prizes-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 20px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.claim-prizes-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.claim-prizes-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 1200px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .card {
    width: 150px;
    height: 120px;
  }

  .game-title {
    font-size: 2rem;
  }

  .progress-info {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .card {
    width: 140px;
    height: 110px;
  }

  .completion-content {
    padding: 20px;
  }

  .prizes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
