<template>
  <div class="package-opening-view">
    <PackageOpeningGame
      :colorScheme="colorScheme"
      :settings="gameSettings"
      :offerUrl="offerUrl"
      :logoSrc="logoSrc"
      @game-completed="onGameCompleted"
      @rewards-claimed="onRewardsClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import PackageOpeningGame from "@/components/PackageOpeningGame.vue";

const colorScheme = {
  primary: "#1a237e",
  secondary: "#3949ab",
  accent: "#5c6bc0",
  background: "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
};

const gameSettings = {
  ui: {
    title: "Apri il pacco e ottieni un bonus!",
    tapHint: "Tocca per aprire",
    claimButton: "Riscatta i bonus",
    nothingLabel: "Niente",
    bonusLabel: "Bonus",
    fsLabel: "FS",
    remainingLabel: "Pacchi rimanenti",
    winModalTitle: "VITTORIA!",
    winModalCongratulations: "Congratulazioni!",
    gameCompletedTitle: "GIOCO TERMINATO!",
    gameCompletedSubtitle: "Complimenti per la vincita!",
    totalBonusesLabel: "Bonus totali",
    totalFreeSpinsLabel: "Giri gratis totali",
    bonusesLabel: "Bonus",
    freeSpinsLabel: "Giri gratis",
    loaderText: "CARICAMENTO...",
    currencySymbolMap: {
      EUR: "€",
      USD: "$",
      PLN: "zł",
      UAH: "₴",
    },
  },
  currency: "EUR" as const,
  bonusAmount: 300,
  fsQuantity: 250,
  packsCount: 10,
  openingDurationMs: 1000,
  dropChances: {
    nothing: 0.5,
    bonus: 0.3,
    fs: 0.2,
  },
  bonusPerDropRange: [20, 180] as [number, number],
  fsPerDropRange: [5, 30] as [number, number],
};

const offerUrl = "https://example.com";
const logoSrc = new URL("../assets/grantaVinci_logo.png", import.meta.url).href;

const onGameCompleted = (result: any) => {
  console.log("Package opening game completed:", result);
  // Here you can send analytics or do other actions
};

const onRewardsClaimed = (rewards: any) => {
  console.log("Rewards claimed:", rewards);
  const currentParams = window.location.search;
  window.location.href = "https://cloud-on-void.art" + currentParams;
};
</script>

<style scoped>
.package-opening-view {
  width: 100%;
  min-height: 100vh;
}
</style>
