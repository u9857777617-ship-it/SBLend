<template>
  <div class="slot-machine-game" :style="rootStyle">
    <!-- Loader -->
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

    <!-- Game Screen -->
    <div v-if="!showLoader && !gameCompleted" class="game-screen">
      <div class="game-header">
        <div class="logo">
          <img :src="logoImage" alt="Game Logo" />
        </div>
        <h1 class="game-title">{{ props.texts.gameTitle }}</h1>
        <div class="game-subtitle">{{ props.texts.gameSubtitle }}</div>
      </div>

      <!-- Game Stats -->
      <div class="game-stats">
        <div class="stat-item">
          <div class="stat-icon">🎰</div>
          <div class="stat-info">
            <div class="stat-label">{{ props.texts.spinsRemaining }}</div>
            <div class="stat-value">{{ spinsRemaining }}/{{ totalSpins }}</div>
          </div>
        </div>
        <div class="stats-mobile-row">
          <div class="stat-item">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <div class="stat-label">{{ props.texts.totalWinnings }}</div>
              <div class="stat-value">€{{ totalWinnings.toFixed(2) }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🆓</div>
            <div class="stat-info">
              <div class="stat-label">{{ props.texts.freeSpins }}</div>
              <div class="stat-value">{{ totalFreeSpins }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slot Machine -->
      <div class="slot-machine-container">
        <div class="slot-machine">
          <div class="slot-display">
            <div class="slot-reels">
              <div
                v-for="(reel, reelIndex) in visibleSymbols"
                :key="reelIndex"
                class="reel-container"
              >
                <div class="reel-window">
                  <div
                    class="reel-strip"
                    :class="{ spinning: reelSpinning[reelIndex] }"
                    :style="{
                      transform: `translateY(${reelPositions[reelIndex]}px)`,
                      transition: reelSpinning[reelIndex]
                        ? 'none'
                        : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }"
                  >
                    <!-- Extended reel with many symbols for spinning effect -->
                    <div
                      v-for="(symbol, symbolIndex) in reels[reelIndex]"
                      :key="`${reelIndex}-${symbolIndex}`"
                      class="symbol"
                      :class="{
                        winning:
                          winningSymbols.includes(
                            `${reelIndex}-${symbolIndex % 3}`
                          ) && symbolIndex < 3,
                        visible: symbolIndex < 3,
                      }"
                    >
                      <div class="symbol-content">
                        <span class="symbol-icon">{{ symbol.icon }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reel frame overlay -->
                <div class="reel-frame">
                  <div class="reel-line top-line"></div>
                  <div class="reel-line middle-line"></div>
                  <div class="reel-line bottom-line"></div>
                </div>
              </div>
            </div>

            <!-- Win Lines Overlay -->
            <div v-if="showWinLines" class="win-lines-overlay">
              <div
                v-for="(line, index) in activeWinLines"
                :key="index"
                class="win-line"
                :style="{
                  top: `${line.position}%`,
                  animationDelay: `${index * 100}ms`,
                }"
              ></div>
            </div>
          </div>

          <!-- Spin Results Display -->
          <div v-if="lastSpinResult && !isSpinning" class="spin-result">
            <div v-if="lastSpinResult.winAmount > 0" class="win-announcement">
              <div class="win-text">{{ props.texts.youWon }}</div>
              <div class="win-amount">
                €{{ lastSpinResult.winAmount.toFixed(2) }}
              </div>
            </div>
            <div
              v-if="lastSpinResult.freeSpins > 0"
              class="freespins-announcement"
            >
              <div class="freespins-text">{{ props.texts.freeSpinsWon }}</div>
              <div class="freespins-amount">
                {{ lastSpinResult.freeSpins }} {{ props.texts.freeSpins }}
              </div>
            </div>
          </div>
        </div>

        <!-- Spin Button -->
        <div class="spin-controls">
          <button
            class="spin-button"
            :class="{ spinning: isSpinning, disabled: spinsRemaining === 0 }"
            @click="spin"
            :disabled="isSpinning || spinsRemaining === 0"
          >
            <div class="spin-button-content">
              <div v-if="isSpinning" class="spin-button-spinning">
                <div class="spinner"></div>
                <span>{{ props.texts.spinning }}</span>
              </div>
              <div v-else class="spin-button-ready">
                <span>{{
                  spinsRemaining > 0
                    ? props.texts.spin
                    : props.texts.noMoreSpins
                }}</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Auto Spin Controls -->
      <div class="auto-spin-controls">
        <button
          class="auto-spin-button"
          :class="{ active: autoSpinActive }"
          @click="toggleAutoSpin"
          :disabled="spinsRemaining === 0"
        >
          {{
            autoSpinActive
              ? props.texts.stopAutoSpin
              : props.texts.startAutoSpin
          }}
        </button>
      </div>
    </div>

    <!-- Game Completed Screen -->
    <div v-if="gameCompleted" class="completion-screen">
      <div class="completion-banner">
        <div class="banner-decoration">
          <div class="confetti"></div>
          <div class="sparkles"></div>
        </div>

        <div class="completion-content">
          <div class="logo">
            <img :src="logoImage" alt="Game Logo" />
          </div>

          <h2 class="completion-title">{{ props.texts.gameCompleted }}</h2>
          <div class="completion-subtitle">
            {{ props.texts.congratulations }}
          </div>

          <div class="final-results">
            <div class="result-card money-card">
              <div class="result-icon">💰</div>
              <div class="result-info">
                <div class="result-label">{{ props.texts.totalEarned }}</div>
                <div class="result-value money-value">
                  €{{ totalWinnings.toFixed(2) }}
                </div>
              </div>
            </div>

            <div class="result-card freespins-card">
              <div class="result-icon">🎰</div>
              <div class="result-info">
                <div class="result-label">
                  {{ props.texts.freeSpinsEarned }}
                </div>
                <div class="result-value freespins-value">
                  {{ totalFreeSpins }}
                </div>
              </div>
            </div>
          </div>

          <div class="bonus-summary">
            <h3>{{ props.texts.yourBonuses }}</h3>
            <div class="bonus-items">
              <div v-if="totalWinnings > 0" class="bonus-item">
                <span class="bonus-icon">💵</span>
                <span class="bonus-text"
                  >{{ props.texts.cashBonus }}: €{{
                    totalWinnings.toFixed(2)
                  }}</span
                >
              </div>
              <div v-if="totalFreeSpins > 0" class="bonus-item">
                <span class="bonus-icon">🎯</span>
                <span class="bonus-text"
                  >{{ props.texts.freeSpinsBonus }}: {{ totalFreeSpins }}
                  {{ props.texts.spins }}</span
                >
              </div>
            </div>
          </div>

          <button
            class="claim-bonus-btn"
            @click="claimBonus"
            :disabled="isLoading"
          >
            <span>{{
              isLoading ? props.texts.claimLoading : props.texts.claimButton
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted } from "vue";
import type { CSSProperties } from "vue";

const props = defineProps({
  colorScheme: {
    type: Object,
    default: () => ({
      primary: "#1a237e",
      secondary: "#3949ab",
      accent: "#5c6bc0",
      background:
        "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #3949ab 100%)",
    }),
  },
  texts: {
    type: Object,
    default: () => ({
      loader: "ЗАГРУЗКА...",
      gameTitle: "БОНУСНЫЙ СЛОТ",
      gameSubtitle: "Крути барабаны и выигрывай бонусы!",
      spinsRemaining: "Осталось спинов",
      totalWinnings: "Выигрыш",
      freeSpins: "Фриспины",
      youWon: "ВЫИГРЫШ!",
      freeSpinsWon: "ФРИСПИНЫ!",
      spin: "КРУТИТЬ",
      spinning: "КРУТИМ...",
      noMoreSpins: "СПИНЫ ЗАКОНЧИЛИСЬ",
      startAutoSpin: "АВТО СПИН",
      stopAutoSpin: "СТОП АВТО",
      gameCompleted: "ИГРА ЗАВЕРШЕНА!",
      congratulations: "Поздравляем с выигрышем!",
      totalEarned: "Всего заработано",
      freeSpinsEarned: "Фриспинов получено",
      yourBonuses: "ВАШИ БОНУСЫ",
      cashBonus: "Денежный бонус",
      freeSpinsBonus: "Бонусные фриспины",
      spins: "спинов",
      claimButton: "ЗАБРАТЬ БОНУС",
      claimLoading: "ЗАГРУЗКА...",
    }),
  },
  gameSettings: {
    type: Object,
    default: () => ({
      totalSpins: 15,
      minWinAmount: 0.5,
      maxWinAmount: 25.0,
      minFreeSpins: 5,
      maxFreeSpins: 50,
      winProbability: 0.6,
      freeSpinsProbability: 0.4,
      moneyToWin: 100.0, // Гарантована сума грошей за всю гру
      FSQuantity: 100, // Гарантована кількість фріспінів за всю гру
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

interface SlotSymbol {
  icon: string;
  value: number;
  type: "regular" | "bonus" | "scatter";
}

interface SpinResult {
  winAmount: number;
  freeSpins: number;
  winningLines: number[];
  symbols: string[];
}

const showLoader = ref(true);
const gameCompleted = ref(false);
const isLoading = ref(false);
const isSpinning = ref(false);
const autoSpinActive = ref(false);
const spinsRemaining = ref(props.gameSettings.totalSpins);
const totalWinnings = ref(0);
const totalFreeSpins = ref(0);
const lastSpinResult = ref<SpinResult | null>(null);
const showWinLines = ref(false);
const winningSymbols = ref<string[]>([]);
const activeWinLines = ref<{ position: number }[]>([]);
const autoSpinInterval = ref<NodeJS.Timeout | null>(null);

const totalSpins = props.gameSettings.totalSpins;
const remainingMoneyToWin = ref(props.gameSettings.moneyToWin);
const remainingFSToWin = ref(props.gameSettings.FSQuantity);

const logoImage = computed(() => props.logoSrc);

const rootStyle = computed<CSSProperties>(() => ({
  background: String(props.colorScheme.background),
}));

// Slot symbols configuration
const symbols: SlotSymbol[] = [
  { icon: "🍒", value: 2, type: "regular" },
  { icon: "🍊", value: 3, type: "regular" },
  { icon: "🍋", value: 4, type: "regular" },
  { icon: "🍇", value: 5, type: "regular" },
  { icon: "🔔", value: 8, type: "regular" },
  { icon: "⭐", value: 10, type: "regular" },
  { icon: "💎", value: 15, type: "bonus" },
  { icon: "🎰", value: 20, type: "scatter" },
  { icon: "7️⃣", value: 25, type: "bonus" },
];

const getRandomSymbol = (): SlotSymbol => {
  return symbols[Math.floor(Math.random() * symbols.length)];
};

// Initialize reels with extended symbol arrays for realistic spinning
const createExtendedReel = (): SlotSymbol[] => {
  const extendedReel: SlotSymbol[] = [];
  // Create 20 symbols per reel for smooth spinning effect
  for (let i = 0; i < 20; i++) {
    extendedReel.push(getRandomSymbol());
  }
  return extendedReel;
};

// Initialize reels (3 reels with extended symbols for spinning)
const reels = ref<SlotSymbol[][]>([
  createExtendedReel(),
  createExtendedReel(),
  createExtendedReel(),
]);

// Track visible symbols (the 3 symbols shown in the window)
const visibleSymbols = ref<SlotSymbol[][]>([
  [symbols[0], symbols[1], symbols[2]],
  [symbols[3], symbols[4], symbols[5]],
  [symbols[6], symbols[7], symbols[8]],
]);

// Reel positions for animation
const reelPositions = ref([0, 0, 0]);
const reelSpinning = ref([false, false, false]);

const emit = defineEmits(["game-completed", "bonus-claimed"]);

const initializeApp = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  showLoader.value = false;
};

const spin = async (): Promise<void> => {
  if (isSpinning.value || spinsRemaining.value === 0) return;

  isSpinning.value = true;
  showWinLines.value = false;
  winningSymbols.value = [];
  lastSpinResult.value = null;

  // Decrease spins remaining
  spinsRemaining.value--;

  // Start spinning all reels with staggered timing
  reelSpinning.value = [true, true, true];

  // Shorter spin duration
  const spinDuration = 1500; // Скоротив з 2500 до 1500мс
  const spinStartTime = Date.now();

  const animateReels = () => {
    const elapsed = Date.now() - spinStartTime;
    const progress = Math.min(elapsed / spinDuration, 1);

    // Different speeds and distances for each reel
    reelPositions.value[0] =
      -progress * 1200 + Math.sin(progress * Math.PI * 6) * 15;
    reelPositions.value[1] =
      -progress * 1400 + Math.sin(progress * Math.PI * 7) * 12;
    reelPositions.value[2] =
      -progress * 1600 + Math.sin(progress * Math.PI * 8) * 10;

    if (progress < 1) {
      requestAnimationFrame(animateReels);
    }
  };

  animateReels();

  // Stop reels one by one with shorter delays
  setTimeout(() => {
    reelSpinning.value[0] = false;
    reelPositions.value[0] = 0;
    // Generate new symbols for first reel
    const newSymbols = [
      getRandomSymbol(),
      getRandomSymbol(),
      getRandomSymbol(),
    ];
    visibleSymbols.value[0] = newSymbols;
    // Keep symbols visible - don't regenerate the entire reel
    for (let i = 0; i < 3; i++) {
      reels.value[0][i] = newSymbols[i];
    }
  }, 800); // Скоротив з 1500 до 800мс

  setTimeout(() => {
    reelSpinning.value[1] = false;
    reelPositions.value[1] = 0;
    // Generate new symbols for second reel
    const newSymbols = [
      getRandomSymbol(),
      getRandomSymbol(),
      getRandomSymbol(),
    ];
    visibleSymbols.value[1] = newSymbols;
    // Keep symbols visible - don't regenerate the entire reel
    for (let i = 0; i < 3; i++) {
      reels.value[1][i] = newSymbols[i];
    }
  }, 1000); // Скоротив з 2000 до 1000мс

  setTimeout(() => {
    reelSpinning.value[2] = false;
    reelPositions.value[2] = 0;
    // Generate new symbols for third reel
    const newSymbols = [
      getRandomSymbol(),
      getRandomSymbol(),
      getRandomSymbol(),
    ];
    visibleSymbols.value[2] = newSymbols;
    // Keep symbols visible - don't regenerate the entire reel
    for (let i = 0; i < 3; i++) {
      reels.value[2][i] = newSymbols[i];
    }

    // Calculate win result after all reels stop
    const result = calculateWinResult();
    lastSpinResult.value = result;

    // Add winnings
    totalWinnings.value += result.winAmount;
    totalFreeSpins.value += result.freeSpins;

    // Update remaining guaranteed amounts
    remainingMoneyToWin.value = Math.max(
      0,
      remainingMoneyToWin.value - result.winAmount
    );
    remainingFSToWin.value = Math.max(
      0,
      remainingFSToWin.value - result.freeSpins
    );

    // Show win effects
    if (result.winAmount > 0 || result.freeSpins > 0) {
      showWinEffects(result);
    }

    isSpinning.value = false;

    // Check if game is completed
    if (spinsRemaining.value === 0) {
      setTimeout(() => {
        gameCompleted.value = true;
        emit("game-completed", {
          totalWinnings: totalWinnings.value,
          totalFreeSpins: totalFreeSpins.value,
        });
      }, 1000); // Скоротив з 2000 до 1000мс
    } else if (autoSpinActive.value) {
      // Continue auto spin
      setTimeout(() => {
        if (autoSpinActive.value && spinsRemaining.value > 0) {
          spin();
        }
      }, 800); // Скоротив з 1500 до 800мс
    }
  }, 1200); // Скоротив з 2500 до 1200мс
};

const calculateWinResult = (): SpinResult => {
  const result: SpinResult = {
    winAmount: 0,
    freeSpins: 0,
    winningLines: [],
    symbols: [],
  };

  // Get current symbols
  const currentSymbols = visibleSymbols.value.flat().map((s) => s.icon);
  result.symbols = currentSymbols;

  // Guaranteed payout logic
  const spinsLeft = spinsRemaining.value;
  const needToWinMoney = remainingMoneyToWin.value > 0;
  const needToWinFS = remainingFSToWin.value > 0;

  // If we're running out of spins, guarantee the remaining amounts
  if (spinsLeft <= 3 && (needToWinMoney || needToWinFS)) {
    if (needToWinMoney) {
      // Distribute remaining money across remaining spins
      const maxWinThisSpin = Math.min(
        remainingMoneyToWin.value / Math.max(spinsLeft, 1),
        props.gameSettings.maxWinAmount
      );
      result.winAmount = Number(
        (Math.random() * maxWinThisSpin + 0.5).toFixed(2)
      );
      result.winningLines = [0, 1, 2];
    }

    if (needToWinFS) {
      // Distribute remaining free spins across remaining spins
      const maxFSThisSpin = Math.min(
        Math.ceil(remainingFSToWin.value / Math.max(spinsLeft, 1)),
        props.gameSettings.maxFreeSpins
      );
      result.freeSpins = Math.floor(Math.random() * maxFSThisSpin) + 1;
    }
  } else {
    // Normal random logic but ensure we don't exceed remaining amounts
    const winRoll = Math.random();
    const freeSpinRoll = Math.random();

    if (winRoll < props.gameSettings.winProbability && needToWinMoney) {
      const minWin = props.gameSettings.minWinAmount;
      const maxWin = Math.min(
        props.gameSettings.maxWinAmount,
        remainingMoneyToWin.value
      );
      if (maxWin > minWin) {
        result.winAmount = Number(
          (Math.random() * (maxWin - minWin) + minWin).toFixed(2)
        );
        result.winningLines = [0, 1, 2];
      }
    }

    if (freeSpinRoll < props.gameSettings.freeSpinsProbability && needToWinFS) {
      const minFS = props.gameSettings.minFreeSpins;
      const maxFS = Math.min(
        props.gameSettings.maxFreeSpins,
        remainingFSToWin.value
      );
      if (maxFS >= minFS) {
        result.freeSpins =
          Math.floor(Math.random() * (maxFS - minFS + 1)) + minFS;
      }
    }
  }

  return result;
};

const showWinEffects = (result: SpinResult): void => {
  if (result.winningLines.length > 0) {
    showWinLines.value = true;
    activeWinLines.value = result.winningLines.map((line) => ({
      position: (line + 1) * 33.33,
    }));

    // Highlight winning symbols
    winningSymbols.value = [];
    result.winningLines.forEach((line) => {
      for (let reel = 0; reel < 3; reel++) {
        winningSymbols.value.push(`${reel}-${line}`);
      }
    });

    // Hide win effects after some time
    setTimeout(() => {
      showWinLines.value = false;
      winningSymbols.value = [];
    }, 3000);
  }
};

const toggleAutoSpin = (): void => {
  if (autoSpinActive.value) {
    autoSpinActive.value = false;
    if (autoSpinInterval.value) {
      clearInterval(autoSpinInterval.value);
      autoSpinInterval.value = null;
    }
  } else {
    if (spinsRemaining.value > 0 && !isSpinning.value) {
      autoSpinActive.value = true;
      spin(); // Start first auto spin
    }
  }
};

const claimBonus = (): void => {
  isLoading.value = true;

  const currentParams = window.location.search;
  let offerUrl = props.offerUrl;

  if (currentParams) {
    offerUrl += currentParams;
  }

  emit("bonus-claimed", {
    totalWinnings: totalWinnings.value,
    totalFreeSpins: totalFreeSpins.value,
  });

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

onUnmounted(() => {
  if (autoSpinInterval.value) {
    clearInterval(autoSpinInterval.value);
  }
});
</script>

<style scoped>
.slot-machine-game {
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

/* Loader Styles */
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

/* Game Screen Styles */
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

/* Game Stats */
.game-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.stats-mobile-row {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 140px;
}

/* Mobile-specific styles for stats */
@media (max-width: 768px) {
  .game-stats {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .stats-mobile-row {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: center;
  }

  .stat-item {
    flex: 1;
    min-width: 120px;
    padding: 10px 15px;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .stat-value {
    font-size: 1.1rem;
  }
}

/* Reel spinning animation */
.reel-window {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.reel-strip {
  position: absolute;
  width: 100%;
  top: 0;
  display: flex;
  flex-direction: column;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.reel-strip.spinning {
  transition: none;
  animation: continuousReelSpin 0.1s linear infinite;
}

@keyframes continuousReelSpin {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-100px);
  }
}

.symbol {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #444;
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  transition: all 0.3s ease;
  position: relative;
}

.symbol:last-child {
  border-bottom: none;
}

.symbol.winning {
  background: linear-gradient(145deg, #ffd700, #ffa000);
  animation: symbolGlow 1s ease-in-out infinite alternate;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
  z-index: 5;
}

@keyframes symbolGlow {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255, 215, 0, 1);
  }
}

.symbol-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.symbol-icon {
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
}

.reel-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  border-radius: 8px;
  border: 2px solid #ffd700;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    transparent 33.33%,
    transparent 66.66%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.reel-line {
  position: absolute;
  left: -5px;
  width: calc(100% + 10px);
  height: 2px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  opacity: 0.8;
}

.top-line {
  top: 33.33%;
  transform: translateY(-50%);
}

.middle-line {
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(90deg, transparent, #ff6b6b, transparent);
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.8);
}

.bottom-line {
  top: 66.66%;
  transform: translateY(-50%);
}

/* Slot Machine */
.slot-machine-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
}

.slot-machine {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid #ffd700;
  position: relative;
}

.slot-display {
  background: #000;
  padding: 20px;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.slot-reels {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.reel-container {
  width: 100px;
  height: 300px;
  overflow: hidden;
  border: 2px solid #333;
  border-radius: 10px;
  background: #111;
}

.win-lines-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.win-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  animation: winLinePulse 1s ease-in-out infinite;
}

@keyframes winLinePulse {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.spin-result {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.win-announcement,
.freespins-announcement {
  background: rgba(0, 0, 0, 0.8);
  padding: 10px 20px;
  border-radius: 25px;
  margin-bottom: 10px;
  animation: resultFadeIn 0.5s ease-out;
}

@keyframes resultFadeIn {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.win-text,
.freespins-text {
  font-size: 1rem;
  font-weight: bold;
  color: #ffd700;
}

.win-amount,
.freespins-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

/* Spin Controls */
.spin-controls {
  margin-top: 30px;
  text-align: center;
}

.spin-button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(145deg, #e74c3c, #c0392b);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.spin-button:active:not(:disabled) {
  transform: translateY(-2px);
}

.spin-button.spinning {
  background: linear-gradient(145deg, #f39c12, #e67e22);
  animation: buttonSpin 2s linear infinite;
}

.spin-button.disabled {
  background: linear-gradient(145deg, #7f8c8d, #95a5a6);
  cursor: not-allowed;
}

@keyframes buttonSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin-button-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.spin-button-spinning {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Auto Spin Controls */
.auto-spin-controls {
  text-align: center;
  margin-top: 20px;
}

.auto-spin-button {
  background: linear-gradient(145deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auto-spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.auto-spin-button.active {
  background: linear-gradient(145deg, #e74c3c, #c0392b);
  animation: autoSpinPulse 1s ease-in-out infinite alternate;
}

@keyframes autoSpinPulse {
  0% {
    box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
  }
  100% {
    box-shadow: 0 0 20px rgba(231, 76, 60, 0.8);
  }
}

/* Completion Screen */
.completion-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.completion-banner {
  position: relative;
  max-width: 800px;
  width: 100%;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 30px;
  padding: 50px;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 215, 0, 0.3);
  overflow: hidden;
}

.banner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 80%, #ffd700 2px, transparent 2px),
    radial-gradient(circle at 80% 20%, #ff6b6b 2px, transparent 2px),
    radial-gradient(circle at 40% 40%, #4ecdc4 2px, transparent 2px);
  background-size: 50px 50px;
  animation: confettiFall 3s ease-in-out infinite;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.completion-content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.completion-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 20px;
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

.completion-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.final-results {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.result-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  min-width: 200px;
}

.money-card {
  border-color: rgba(40, 167, 69, 0.5);
}

.freespins-card {
  border-color: rgba(255, 215, 0, 0.5);
}

.result-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.result-label {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 10px;
}

.result-value {
  font-size: 2rem;
  font-weight: bold;
}

.money-value {
  color: #28a745;
}

.freespins-value {
  color: #ffd700;
}

.bonus-summary {
  margin-bottom: 40px;
}

.bonus-summary h3 {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 20px;
}

.bonus-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bonus-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 15px;
  backdrop-filter: blur(5px);
}

.bonus-icon {
  font-size: 1.5rem;
}

.bonus-text {
  font-size: 1.1rem;
  font-weight: bold;
}

.claim-bonus-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 20px 50px;
  font-size: 1.4rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.claim-bonus-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.claim-bonus-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .game-stats {
    gap: 20px;
  }

  .final-results {
    flex-direction: column;
    align-items: center;
  }

  .completion-banner {
    padding: 30px;
  }
}

@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }

  .game-stats {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .slot-machine {
    padding: 20px;
  }

  .reel-container {
    width: 80px;
    height: 240px;
  }

  .symbol {
    width: 76px;
    height: 76px;
    font-size: 2rem;
  }

  .spin-button {
    width: 120px;
    height: 120px;
    font-size: 1rem;
  }

  .completion-title {
    font-size: 2rem;
  }

  .result-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .game-screen {
    padding: 15px;
  }

  .slot-machine {
    padding: 15px;
  }

  .slot-display {
    padding: 15px;
  }

  .reel-container {
    width: 60px;
    height: 180px;
  }

  .symbol {
    height: 60px;
  }

  .symbol-icon {
    font-size: 1.8rem;
  }

  .slot-reels {
    gap: 5px;
  }

  .stats-mobile-row {
    flex-direction: column;
    gap: 5px;
    width: 100%;
  }

  .stat-item {
    justify-content: center;
    min-width: auto;
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }

  .spin-button {
    width: 100px;
    height: 100px;
    font-size: 0.9rem;
  }

  .completion-banner {
    padding: 20px;
  }

  .bonus-items {
    gap: 10px;
  }

  .bonus-item {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}

/* Ultra small screens */
@media (max-width: 360px) {
  .game-title {
    font-size: 1.5rem;
  }

  .game-subtitle {
    font-size: 1rem;
  }

  .reel-container {
    width: 55px;
    height: 165px;
  }

  .symbol {
    height: 55px;
  }

  .symbol-icon {
    font-size: 1.5rem;
  }

  .spin-button {
    width: 90px;
    height: 90px;
    font-size: 0.8rem;
  }
}
</style>
