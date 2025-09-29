<template>
  <div class="pl-package-view">
    <PlPackageOpeningGame
      :color-scheme="colorScheme"
      :settings="settings"
      :offer-url="offerUrl"
      :logo-src="logoSrc"
      @game-completed="onGameCompleted"
      @rewards-claimed="onRewardsClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PlPackageOpeningGame from "../components/PlPackageOpeningGame.vue";

const colorScheme = ref({
  primary: "#1a237e",
  secondary: "#3949ab",
  accent: "#5c6bc0",
  background: "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
});

const settings = ref({
  ui: {
    title: "Otwórz paczkę",
    tapHint: "Dotknij, aby otworzyć",
    claimButton: "Odbierz bonusy",
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
  currency: "PLN" as const,
  bonusAmount: 350,
  fsQuantity: 250,
  packsCount: 5,
  openingDurationMs: 1000,
  dropChances: { nothing: 0.5, bonus: 0.3, fs: 0.2 },
  bonusPerDropRange: [20, 180] as [number, number],
  fsPerDropRange: [5, 30] as [number, number],
});

const offerUrl = ref("https://berry-fig.cloud");
const logoSrc = ref(
  new URL("../assets/pl-package/loto-logo.png", import.meta.url).href
);

const onGameCompleted = (data: any) => {
  console.log("Game completed:", data);
};

const onRewardsClaimed = (data: any) => {
  console.log("Rewards claimed:", data);
};
</script>

<style scoped>
.pl-package-view {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>


