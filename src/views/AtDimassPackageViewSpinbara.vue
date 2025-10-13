<template>
  <div class="package-opening-view">
    <PlPackageOpeningGame
      :colorScheme="colorScheme"
      :settings="gameSettings"
      :offerUrl="offerUrl"
      :logoSrc="atLogo"
      :packageClosedSrc="atClosed"
      :packageOpenedSrc="atOpened"
      @game-completed="onGameCompleted"
      @rewards-claimed="onRewardsClaimed"
    />
  </div>
</template>




<script setup lang="ts">
import { computed } from 'vue';
import PlPackageOpeningGame from '@/components/PlPackageOpeningGame.vue';


// AT (Austria) assets
import atLogo from "@/assets/at-package/at_lotterein_logo.webp"; // logo img
import atClosed from "@/assets/at-package/at_closed_package.webp"; // closed img
import atOpened from "@/assets/at-package/at_opened_package.webp"; // opened img

// Динамічний фон
const colorScheme = computed(() => ({
  primary: '#8B0000',
  secondary: '#C21807',
  accent: '#FF6F00',
  background: 'linear-gradient(135deg, #8B0000 0%, #C21807 50%, #FF6F00 100%)',
}));

// Налаштування гри
const gameSettings = {
  ui: {
    title: 'Öffne das Paket',
    tapHint: 'Tippe, um zu öffnen',
    claimButton: 'Bonus abholen',
    nothingLabel: 'Nichts',
    bonusLabel: 'Bonus',
    fsLabel: 'FS',
    remainingLabel: 'Verbleibende Pakete',
    winModalTitle: 'GEWINN!',
    winModalCongratulations: 'Glückwunsch!',
    gameCompletedTitle: 'SPIEL BEENDET!',
    gameCompletedSubtitle: 'Glückwunsch zum Gewinn!',
    totalBonusesLabel: 'Gesamtbonus',
    totalFreeSpinsLabel: 'Gesamt-Freispiele',
    bonusesLabel: 'Bonus',
    freeSpinsLabel: 'Freispiele',
    loaderText: 'LADEN...',
    currencySymbolMap: { EUR: '€', USD: '$', PLN: 'zł', UAH: '₴' },
  },
  currency: 'EUR',
  bonusAmount: 500,
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

const offerUrl = 'https://planetcode.today';

const onGameCompleted = (_r: any) => { };
const onRewardsClaimed = (_r: any) => { };
</script>
