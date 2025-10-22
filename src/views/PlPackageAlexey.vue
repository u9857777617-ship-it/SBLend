<template>
  <div class="package-opening-view">
    <PlPackageOpeningGame
      :colorScheme="colorScheme"
      :settings="gameSettings"
      :offerUrl="offerUrl"
      :logoSrc="plLogo"
      :packageClosedSrc="plClosed"
      :packageOpenedSrc="plOpened"
      @game-completed="onGameCompleted"
      @rewards-claimed="onRewardsClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import PlPackageOpeningGame from "@/components/PlPackageOpeningGame.vue";

// 🇵🇱 PL (Poland) assets
import plLogo from "@/assets/pl-package/loto-logo.png";
import plClosed from "@/assets/pl-package/closed-package.png";
import plOpened from "@/assets/pl-package/opened-package.png";

// 🎨 Динамічна кольорова схема
const colorScheme = computed(() => ({
  primary: "#1A237E",
  secondary: "#3949AB",
  accent: "#5C6BC0",
  background: "linear-gradient(135deg, #1A237E 0%, #3949AB 50%, #5C6BC0 100%)",
}));

// ⚙️ Налаштування гри
const gameSettings = {
  ui: {
    title: "Otwórz paczkę",
    tapHint: "Dotknij, aby otworzyć",
    claimButton: "Odbierz bonus",
    nothingLabel: "Nic",
    bonusLabel: "Bonus",
    fsLabel: "FS",
    remainingLabel: "Pozostało paczek",
    winModalTitle: "WYGRANA!",
    winModalCongratulations: "Gratulacje!",
    gameCompletedTitle: "GRA ZAKOŃCZONA!",
    gameCompletedSubtitle: "Gratulujemy wygranej!",
    totalBonusesLabel: "Łączne bonusy",
    totalFreeSpinsLabel: "Łączne darmowe spiny",
    bonusesLabel: "Bonusy",
    freeSpinsLabel: "Darmowe spiny",
    loaderText: "ŁADOWANIE...",
    currencySymbolMap: { EUR: "€", USD: "$", PLN: "zł", UAH: "₴" },
  },
  currency: "PLN",
  bonusAmount: 3000,
  fsQuantity: 250,
  packsCount: 5,
  openingDurationMs: 1000,
  dropChances: {
    nothing: 0.5,
    bonus: 0.3,
    fs: 0.2,
  },
  bonusPerDropRange: [20, 180],
  fsPerDropRange: [5, 30],
};

// 🔗 Посилання на оффер
const offerUrl = "https://globespell.gold";

// 🧩 Обробники подій
const onGameCompleted = (_result: any) => {};
const onRewardsClaimed = (_result: any) => {};
</script>

<style scoped>
.package-opening-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
