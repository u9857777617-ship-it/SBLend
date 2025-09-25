<template>
  <div class="package-opening-game" :style="rootStyle">
    <!-- Loader -->
    <div v-if="showLoader" class="loader">
      <div class="loader-logo">
        <img
          :src="logoImage"
          alt="Game Logo"
          decoding="async"
          fetchpriority="high"
          loading="eager"
          @load="onLogoLoad"
          @error="onLogoError"
        />
      </div>
      <div class="loader-spinner"></div>
      <div class="loader-text">{{ settings.ui.loaderText }}</div>
    </div>

    <!-- Win Modal Overlay -->
    <div v-if="showWinModal" class="win-modal-overlay" @click="closeWinModal">
      <div class="win-modal" :class="{ show: showWinModal }">
        <div class="win-modal-content">
          <div class="win-text-main">{{ settings.ui.winModalTitle }}</div>
          <div class="win-details">
            <div v-if="lastWinAmount > 0" class="win-amount">
              {{ lastWinAmount }}{{ currencySymbol }}
            </div>
            <div v-if="lastWinFs > 0" class="win-fs">{{ lastWinFs }} FS</div>
          </div>
          <div class="win-congratulations">
            {{ settings.ui.winModalCongratulations }}
          </div>
        </div>
        <div class="win-effects">
          <div class="confetti-container">
            <div
              v-for="i in 20"
              :key="i"
              class="confetti-piece"
              :style="getConfettiStyle(i)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Game Screen -->
    <div v-if="!showLoader && !gameCompleted" class="game-screen">
      <div class="game-header">
        <div class="logo">
          <img :src="logoImage" alt="Game Logo" />
        </div>
        <h1 class="game-title">{{ settings.ui.title }}</h1>
      </div>

      <!-- Current Totals Display as badges above counter -->
      <div class="totals-badges">
        <div class="badge-item bonus-badge">
          <div class="badge-icon">💰</div>
          <div class="badge-info">
            <div class="badge-label">{{ settings.ui.bonusesLabel }}</div>
            <div class="badge-value">{{ totalBonus }}{{ currencySymbol }}</div>
          </div>
        </div>
        <div class="badge-item fs-badge">
          <div class="badge-icon">🎰</div>
          <div class="badge-info">
            <div class="badge-label">{{ settings.ui.freeSpinsLabel }}</div>
            <div class="badge-value">{{ totalFs }}</div>
          </div>
        </div>
      </div>

      <!-- Progress Counter -->
      <div class="progress-counter">
        <div class="counter-label">{{ settings.ui.remainingLabel }}</div>
        <div class="counter-value">
          {{ remaining }} / {{ settings.packsCount }}
        </div>
      </div>

      <!-- Main Package Container -->
      <div class="package-container">
        <button
          class="package-button"
          :class="{ opening: isOpening, opened: revealedDrop !== null }"
          :disabled="isOpening"
          :aria-label="settings.ui.tapHint"
          role="button"
          @click="openPackage"
          @keydown.enter="openPackage"
          @keydown.space.prevent="openPackage"
        >
          <!-- Package Image -->
          <div class="package-image-container">
            <img
              v-if="!isOpening && revealedDrop === null"
              :src="packageClosedImage"
              alt="Закритий пакунок"
              class="package-image package-closed"
              loading="lazy"
              decoding="async"
              @load="onPackageImageLoad"
              @error="onPackageImageError"
            />
            <img
              v-if="isOpening || revealedDrop !== null"
              :src="packageOpenedImage"
              alt="Відкритий пакунок"
              class="package-image package-opened"
              :class="{ 'opening-animation': isOpening }"
              loading="lazy"
              decoding="async"
              @load="onPackageImageLoad"
              @error="onPackageImageError"
            />
          </div>

          <!-- Tap Hint -->
          <div v-if="!isOpening && revealedDrop === null" class="tap-hint">
            {{ settings.ui.tapHint }}
          </div>

          <!-- Revealed Result -->
          <div v-if="revealedDrop && !isOpening" class="reveal-result">
            <div v-if="revealedDrop.type === 'nothing'" class="result-nothing">
              {{ settings.ui.nothingLabel }}
            </div>
            <div v-if="revealedDrop.type === 'bonus'" class="result-bonus">
              {{ settings.ui.bonusLabel }} {{ revealedDrop.amount
              }}{{ currencySymbol }}
            </div>
            <div v-if="revealedDrop.type === 'fs'" class="result-fs">
              {{ settings.ui.fsLabel }} {{ revealedDrop.amount }}
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Game Completed Screen -->
    <div v-if="gameCompleted" class="completion-screen">
      <div class="completion-content">
        <div class="logo">
          <img :src="logoImage" alt="Game Logo" />
        </div>

        <h2 class="completion-title">{{ settings.ui.gameCompletedTitle }}</h2>
        <div class="completion-subtitle">
          {{ settings.ui.gameCompletedSubtitle }}
        </div>

        <div class="final-results">
          <div class="result-card bonus-card">
            <div class="result-icon">💰</div>
            <div class="result-info">
              <div class="result-label">
                {{ settings.ui.totalBonusesLabel }}
              </div>
              <div class="result-value bonus-value">
                {{ totalBonus }}{{ currencySymbol }}
              </div>
            </div>
          </div>

          <div class="result-card fs-card">
            <div class="result-icon">🎰</div>
            <div class="result-info">
              <div class="result-label">
                {{ settings.ui.totalFreeSpinsLabel }}
              </div>
              <div class="result-value fs-value">{{ totalFs }}</div>
            </div>
          </div>
        </div>

        <button
          class="claim-button"
          @click="claimRewards"
          :disabled="isLoading"
        >
          <span>{{
            isLoading ? settings.ui.loaderText : settings.ui.claimButton
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { CSSProperties } from "vue";

type Currency = "EUR" | "USD" | "PLN" | "UAH";

interface Drop {
  type: "nothing" | "bonus" | "fs";
  amount: number;
}

interface Settings {
  ui: {
    title: string;
    tapHint: string;
    claimButton: string;
    nothingLabel: string;
    bonusLabel: string;
    fsLabel: string;
    remainingLabel: string;
    winModalTitle: string;
    winModalCongratulations: string;
    gameCompletedTitle: string;
    gameCompletedSubtitle: string;
    totalBonusesLabel: string;
    totalFreeSpinsLabel: string;
    bonusesLabel: string;
    freeSpinsLabel: string;
    loaderText: string;
    currencySymbolMap: Record<Currency, string>;
  };
  currency: Currency;
  bonusAmount: number;
  fsQuantity: number;
  packsCount: number;
  openingDurationMs: number;
  dropChances: { nothing: number; bonus: number; fs: number };
  bonusPerDropRange: [number, number];
  fsPerDropRange: [number, number];
}

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
  settings: {
    type: Object as () => Settings,
    default: () => ({
      ui: {
        title: "Відкрий пакунок",
        tapHint: "Торкнись, щоб відкрити",
        claimButton: "Забрати бонуси",
        nothingLabel: "Нічого",
        bonusLabel: "Бонус",
        fsLabel: "FS",
        remainingLabel: "Залишилось пакунків",
        winModalTitle: "WIN!",
        winModalCongratulations: "Вітаємо!",
        gameCompletedTitle: "ГРА ЗАВЕРШЕНА!",
        gameCompletedSubtitle: "Вітаємо з виграшем!",
        totalBonusesLabel: "Всього бонусів",
        totalFreeSpinsLabel: "Всього фріспінів",
        bonusesLabel: "Бонуси",
        freeSpinsLabel: "Фріспіни",
        loaderText: "ЗАГРУЗКА...",
        currencySymbolMap: { EUR: "€", USD: "$", PLN: "zł", UAH: "₴" },
      },
      currency: "EUR" as Currency,
      bonusAmount: 3000,
      fsQuantity: 250,
      packsCount: 12,
      openingDurationMs: 1000,
      dropChances: { nothing: 0.5, bonus: 0.3, fs: 0.2 },
      bonusPerDropRange: [20, 180] as [number, number],
      fsPerDropRange: [5, 30] as [number, number],
    }),
  },
  offerUrl: {
    type: String,
    default: "https://example.com",
  },
  logoSrc: {
    type: String,
    default: () =>
      new URL("../assets/grantaVinci_logo.png", import.meta.url).href,
  },
});

// State
const showLoader = ref(true);
const gameCompleted = ref(false);
const isLoading = ref(false);
const remaining = ref(props.settings.packsCount);
const currentIndex = ref(0);
const totalBonus = ref(0);
const totalFs = ref(0);
const isOpening = ref(false);
const revealedDrop = ref<Drop | null>(null);
const showWinModal = ref(false);
const lastWinAmount = ref(0);
const lastWinFs = ref(0);

// Performance optimizations
const isSlowDevice = ref(false);
const imagesLoaded = ref(0);
const totalImages = ref(2); // Logo + package images

// Planned drops array - calculated once at game start
const plannedDrops = ref<Drop[]>([]);

// Debounced functions for better performance
let openPackageTimeout: NodeJS.Timeout | null = null;
let modalTimeout: NodeJS.Timeout | null = null;

const emit = defineEmits(["game-completed", "rewards-claimed"]);

const detectSlowDevice = (): boolean => {
  // Check for slow device indicators
  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;
  const slowConnection =
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g");
  const lowMemory =
    "memory" in performance &&
    (performance as any).memory?.jsHeapSizeLimit < 1073741824; // Less than 1GB
  const oldDevice =
    navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

  return !!(slowConnection || lowMemory || oldDevice);
};

const rootStyle = computed<CSSProperties>(() => ({
  background: String(props.colorScheme.background),
}));

const logoImage = computed(() => props.logoSrc);
const currencySymbol = computed(
  () => props.settings.ui.currencySymbolMap[props.settings.currency]
);
const packageClosedImage = computed(
  () =>
    new URL("../assets/it-package/closed-package.webp", import.meta.url).href
);
const packageOpenedImage = computed(
  () =>
    new URL("../assets/it-package/opened-package.webp", import.meta.url).href
);

/**
 * Plan all drops at game start to ensure exact bonusAmount and fsQuantity totals
 */
function planDrops(settings: Settings): Drop[] {
  const drops: Drop[] = [];
  const {
    packsCount,
    bonusAmount,
    fsQuantity,
    dropChances,
    bonusPerDropRange,
    fsPerDropRange,
  } = settings;

  let remainingBonus = bonusAmount;
  let remainingFs = fsQuantity;

  // First packsCount - 3 drops: use random chances but ensure we distribute some rewards
  const regularDropsCount = Math.max(0, packsCount - 3);

  // Calculate how much to distribute in regular drops vs final drops
  const bonusForRegularDrops = Math.floor(remainingBonus * 0.6); // 60% in regular drops
  const fsForRegularDrops = Math.floor(remainingFs * 0.6); // 60% in regular drops

  let bonusUsedInRegular = 0;
  let fsUsedInRegular = 0;

  for (let i = 0; i < regularDropsCount; i++) {
    const rand = Math.random();
    let drop: Drop;

    if (rand < dropChances.nothing) {
      drop = { type: "nothing", amount: 0 };
    } else if (rand < dropChances.nothing + dropChances.bonus) {
      // Bonus drop
      const maxBonusForThisDrop = Math.min(
        bonusPerDropRange[1],
        bonusForRegularDrops - bonusUsedInRegular
      );
      const minBonusForThisDrop = Math.min(
        bonusPerDropRange[0],
        maxBonusForThisDrop
      );

      if (
        maxBonusForThisDrop > 0 &&
        minBonusForThisDrop <= maxBonusForThisDrop
      ) {
        const amount =
          Math.floor(
            Math.random() * (maxBonusForThisDrop - minBonusForThisDrop + 1)
          ) + minBonusForThisDrop;
        drop = { type: "bonus", amount };
        bonusUsedInRegular += amount;
        remainingBonus -= amount;
      } else {
        drop = { type: "nothing", amount: 0 };
      }
    } else {
      // FS drop
      const maxFsForThisDrop = Math.min(
        fsPerDropRange[1],
        fsForRegularDrops - fsUsedInRegular
      );
      const minFsForThisDrop = Math.min(fsPerDropRange[0], maxFsForThisDrop);

      if (maxFsForThisDrop > 0 && minFsForThisDrop <= maxFsForThisDrop) {
        const amount =
          Math.floor(
            Math.random() * (maxFsForThisDrop - minFsForThisDrop + 1)
          ) + minFsForThisDrop;
        drop = { type: "fs", amount };
        fsUsedInRegular += amount;
        remainingFs -= amount;
      } else {
        drop = { type: "nothing", amount: 0 };
      }
    }

    drops.push(drop);
  }

  // Last 3 drops: guarantee remaining amounts with smart distribution
  const finalDropsCount = Math.min(3, packsCount);
  const finalDrops: Drop[] = [];

  // Create final drops to guarantee remaining amounts
  if (remainingBonus > 0 && remainingFs > 0) {
    // Both bonus and FS remaining - distribute across 3 drops
    const bonusDistribution = distributeFinalAmounts(remainingBonus, 2); // Use 2 slots for bonus
    const fsDistribution = distributeFinalAmounts(remainingFs, 1); // Use 1 slot for FS

    bonusDistribution.forEach((amount) => {
      if (amount > 0) {
        finalDrops.push({ type: "bonus", amount });
      }
    });

    fsDistribution.forEach((amount) => {
      if (amount > 0) {
        finalDrops.push({ type: "fs", amount });
      }
    });
  } else if (remainingBonus > 0) {
    // Only bonus remaining
    const bonusDistribution = distributeFinalAmounts(
      remainingBonus,
      finalDropsCount
    );
    bonusDistribution.forEach((amount) => {
      if (amount > 0) {
        finalDrops.push({ type: "bonus", amount });
      }
    });
  } else if (remainingFs > 0) {
    // Only FS remaining
    const fsDistribution = distributeFinalAmounts(remainingFs, finalDropsCount);
    fsDistribution.forEach((amount) => {
      if (amount > 0) {
        finalDrops.push({ type: "fs", amount });
      }
    });
  }

  // Fill remaining final slots with nothing if needed
  while (finalDrops.length < finalDropsCount) {
    finalDrops.push({ type: "nothing", amount: 0 });
  }

  // Sort final drops by amount (largest last for better UX)
  finalDrops.sort((a, b) => {
    if (a.type === "nothing" && b.type !== "nothing") return -1;
    if (a.type !== "nothing" && b.type === "nothing") return 1;
    return a.amount - b.amount;
  });

  // Add final drops to the end
  drops.push(...finalDrops);

  console.log("Planned drops:", drops);
  console.log(
    "Total bonus planned:",
    drops
      .filter((d) => d.type === "bonus")
      .reduce((sum, d) => sum + d.amount, 0)
  );
  console.log(
    "Total FS planned:",
    drops.filter((d) => d.type === "fs").reduce((sum, d) => sum + d.amount, 0)
  );

  return drops;
}

/**
 * Distribute amount across slots monotonically non-decreasing
 */
function distributeFinalAmounts(totalAmount: number, slots: number): number[] {
  if (slots <= 0) return [];
  if (slots === 1) return [totalAmount];

  const result: number[] = [];
  let remaining = totalAmount;

  for (let i = 0; i < slots; i++) {
    const slotsLeft = slots - i;
    const minForSlot = Math.floor(remaining / slotsLeft);
    const maxForSlot = remaining - (slotsLeft - 1) * minForSlot;

    // For monotonic non-decreasing, use minimum for early slots
    const amount = i === slots - 1 ? remaining : minForSlot;
    result.push(amount);
    remaining -= amount;
  }

  return result;
}

const initializeApp = async (): Promise<void> => {
  // Plan all drops at the start
  plannedDrops.value = planDrops(props.settings);

  await new Promise((resolve) => setTimeout(resolve, 1000));
  showLoader.value = false;
};

const openPackage = async (): Promise<void> => {
  if (isOpening.value || revealedDrop.value !== null) return;

  isOpening.value = true;

  // Start opening animation
  await new Promise((resolve) =>
    setTimeout(resolve, props.settings.openingDurationMs)
  );

  // Reveal the drop result
  const drop = plannedDrops.value[currentIndex.value];
  revealedDrop.value = drop;

  // Update totals
  if (drop.type === "bonus") {
    totalBonus.value += drop.amount;
    lastWinAmount.value = drop.amount;
    lastWinFs.value = 0;
    showWinModal.value = true;
  } else if (drop.type === "fs") {
    totalFs.value += drop.amount;
    lastWinAmount.value = 0;
    lastWinFs.value = drop.amount;
    showWinModal.value = true;
  }

  isOpening.value = false;
  currentIndex.value++;
  remaining.value--;

  // Check if game is completed
  if (remaining.value === 0) {
    setTimeout(() => {
      gameCompleted.value = true;
      emit("game-completed", {
        totalBonus: totalBonus.value,
        totalFs: totalFs.value,
        currency: props.settings.currency,
      });
    }, 1500);
  } else {
    // Auto-reset to closed state after short pause
    setTimeout(() => {
      revealedDrop.value = null;
    }, 300);
  }
};

const claimRewards = (): void => {
  isLoading.value = true;

  const currentParams = window.location.search;
  let offerUrl = props.offerUrl;

  if (currentParams) {
    offerUrl += currentParams;
  }

  emit("rewards-claimed", {
    totalBonus: totalBonus.value,
    totalFs: totalFs.value,
    currency: props.settings.currency,
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

const closeWinModal = (): void => {
  showWinModal.value = false;
};

const getConfettiStyle = (index: number): CSSProperties => {
  const colors = ["#FFD700", "#FF4500", "#1E90FF", "#32CD32", "#FF69B4"];
  const color = colors[index % colors.length];
  const left = `${Math.random() * 100}%`;
  const animationDelay = `${Math.random() * 2}s`;
  const animationDuration = `${Math.random() * 3 + 2}s`;

  return {
    backgroundColor: color,
    left,
    animationDelay,
    animationDuration,
  };
};

const onLogoLoad = (): void => {
  console.log("Logo loaded successfully");
};

const onLogoError = (): void => {
  console.error("Error loading logo");
};

const onPackageImageLoad = (): void => {
  console.log("Package image loaded successfully");
};

const onPackageImageError = (): void => {
  console.error("Error loading package image");
};

onMounted(() => {
  initializeApp();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap");

.package-opening-game {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
  font-family: "Montserrat", "Roboto", "Arial", sans-serif;
  color: white;
  /* Enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
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
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes spin {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }
  100% {
    transform: rotate3d(0, 0, 1, 360deg);
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

/* Game Screen */
.game-screen {
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.game-header {
  text-align: center;
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
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #ffd700, #ffa000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: "Montserrat", sans-serif;
}

/* Totals Badges (above progress counter) */
.totals-badges {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.badge-item {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.bonus-badge {
  border-color: rgba(40, 167, 69, 0.6);
  background: linear-gradient(
    135deg,
    rgba(40, 167, 69, 0.2),
    rgba(40, 167, 69, 0.1)
  );
}

.fs-badge {
  border-color: rgba(255, 215, 0, 0.6);
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.2),
    rgba(255, 215, 0, 0.1)
  );
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-info {
  text-align: left;
}

.badge-label {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 2px;
  text-transform: uppercase;
  font-weight: 600;
  font-family: "Roboto", sans-serif;
}

.badge-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  font-family: "Montserrat", sans-serif;
}

/* Progress Counter */
.progress-counter {
  text-align: center;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 30px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.counter-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 5px;
  font-family: "Roboto", sans-serif;
}

.counter-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  font-family: "Montserrat", sans-serif;
}

/* Package Container - Make packages bigger */
.package-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 20px;
}

.package-button {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 20px;
  border-radius: 20px;
  position: relative;
  max-width: 500px;
  width: 95%;
  /* Enable hardware acceleration */
  transform: translateZ(0);
  will-change: transform;
}

.package-button:hover:not(:disabled) {
  transform: scale3d(1.05, 1.05, 1);
}

.package-button:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.package-button.opening {
  animation: packageShake 0.1s ease-in-out infinite;
}

@keyframes packageShake {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  25% {
    transform: translate3d(-2px, 0, 0);
  }
  75% {
    transform: translate3d(2px, 0, 0);
  }
}

.package-image-container {
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 20px;

  margin: -20% 0 -10% 0;
}

.package-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 15px;
  transition: transform 0.2s ease;
  transform: scale3d(1.2, 1.2, 1);
  /* Enable hardware acceleration */
  will-change: transform;
}

.package-opened.opening-animation {
  animation: openingGlow 1s ease-out;
}

@keyframes openingGlow {
  0% {
    transform: scale3d(1.2, 1.2, 1);
    filter: brightness(1);
  }
  50% {
    transform: scale3d(1.35, 1.35, 1);
    filter: brightness(1.3) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
  }
  100% {
    transform: scale3d(1.2, 1.2, 1);
    filter: brightness(1);
  }
}

.tap-hint {
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  color: #ffd700;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px 25px;
  border-radius: 25px;
  animation: tapHintPulse 2s ease-in-out infinite;
  font-family: "Montserrat", sans-serif;
}

@keyframes tapHintPulse {
  0%,
  100% {
    transform: scale3d(1, 1, 1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    transform: scale3d(1.05, 1.05, 1);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

.reveal-result {
  text-align: center;
  padding: 20px;
  border-radius: 15px;
  background: rgba(0, 0, 0, 0.8);
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

.result-nothing {
  font-size: 1.5rem;
  font-weight: bold;
  color: #888;
}

.result-bonus {
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
  animation: bonusGlow 1s ease-in-out infinite alternate;
}

.result-fs {
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  animation: fsGlow 1s ease-in-out infinite alternate;
}

@keyframes bonusGlow {
  0% {
    text-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
  }
  100% {
    text-shadow: 0 0 20px rgba(40, 167, 69, 0.8);
  }
}

@keyframes fsGlow {
  0% {
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  }
  100% {
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
}

/* Totals Display */
.totals-display {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.total-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.total-icon {
  font-size: 2rem;
}

.total-info {
  text-align: left;
}

.total-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 5px;
}

.total-value {
  font-size: 1.3rem;
  font-weight: bold;
}

/* Completion Screen */
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
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #ffd700, #ffa000);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 2s ease-in-out infinite alternate;
  font-family: "Montserrat", sans-serif;
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

.bonus-card {
  border-color: rgba(40, 167, 69, 0.5);
}

.fs-card {
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

.bonus-value {
  color: #28a745;
}

.fs-value {
  color: #ffd700;
}

.claim-button {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 20px 40px;
  font-size: 1.3rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  font-family: "Montserrat", sans-serif;
}

.claim-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.claim-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design for badges */
@media (max-width: 768px) {
  .game-title {
    font-size: 2rem;
  }

  .totals-badges {
    gap: 15px;
    margin-bottom: 15px;
  }

  .badge-item {
    min-width: 120px;
    padding: 10px 15px;
  }

  .badge-icon {
    font-size: 1.3rem;
  }

  .badge-label {
    font-size: 0.7rem;
  }

  .badge-value {
    font-size: 1.1rem;
  }

  .final-results {
    flex-direction: column;
    align-items: center;
  }

  .completion-content {
    padding: 30px 20px;
  }

  .package-image {
    transform: scale(1.1);
  }
}

@media (max-width: 480px) {
  .game-screen {
    padding: 15px;
  }

  .badge-item {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }

  .package-image {
    transform: scale(1);
  }

  .reveal-result {
    padding: 15px;
  }

  .result-bonus,
  .result-fs {
    font-size: 1.5rem;
  }

  .completion-title {
    font-size: 2rem;
  }

  .result-value {
    font-size: 1.5rem;
  }
}

/* Win Modal Styles */
.win-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.win-modal {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  position: relative;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: scale3d(0.8, 0.8, 1);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Enable hardware acceleration */
  will-change: transform, opacity;
}

.win-modal.show {
  transform: scale3d(1, 1, 1);
  opacity: 1;
}

.win-modal-content {
  position: relative;
  z-index: 1;
}

.win-text-main {
  font-size: 3rem;
  font-weight: 900;
  color: #ffd700;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
}

.win-details {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-family: "Roboto", sans-serif;
}

.win-amount,
.win-fs {
  font-weight: bold;
  color: #28a745;
}

.win-fs {
  color: #1e90ff;
}

.win-congratulations {
  font-size: 1.2rem;
  color: #555;
  font-family: "Roboto", sans-serif;
}

.win-effects {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ffd700;
  animation: confettiFall linear infinite;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
  }
}

/* Reduce confetti for performance on slow devices */
@media (max-width: 768px) and (max-device-pixel-ratio: 2) {
  .confetti-piece {
    display: none;
  }

  .confetti-piece:nth-child(-n + 5) {
    display: block;
  }
}
</style>
