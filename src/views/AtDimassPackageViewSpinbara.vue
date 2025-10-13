<template>
  <div class="package-opening-view">
    <PlPackageOpeningGame
      :colorScheme="colorScheme"
      :settings="gameSettings"
      :offerUrl="offerUrl"
      :logoSrc="resolvedLogo"
      :packageClosedSrc="resolvedClosed"
      :packageOpenedSrc="resolvedOpened"
      @game-completed="onGameCompleted"
      @rewards-claimed="onRewardsClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PlPackageOpeningGame from "@/components/PlPackageOpeningGame.vue";

// AT (Austria) assets
import atLogo from "@/assets/at-package/at_lotterein_logo.webp"; // logo img
import atClosed from "@/assets/at-package/at_closed_package.webp"; // closed img
import atOpened from "@/assets/at-package/at_opened_package.webp"; // opened img

const route = useRoute();

// Динамічний фон: ?bg=<css> або ?bg1&bg2&bg3
const resolveBackground = (): string => {
  const bg = (route.query.bg as string) || "";
  if (bg) return bg;
  const bg1 = (route.query.bg1 as string) || "#8B0000"; // dark red
  const bg2 = (route.query.bg2 as string) || "#C21807"; // red
  const bg3 = (route.query.bg3 as string) || "#FF6F00"; // orange accent
  return `linear-gradient(135deg, ${bg1} 0%, ${bg2} 50%, ${bg3} 100%)`;
};

const colorScheme = computed(() => ({
  primary: (route.query.primary as string) || "#8B0000",
  secondary: (route.query.secondary as string) || "#C21807",
  accent: (route.query.accent as string) || "#FF6F00",
  background: resolveBackground(),
}));

// Пріоритет для картинок: query -> дефолтні AT
const resolvedLogo = computed(() => {
  const q = route.query.logo as string | undefined;
  return q && q.length ? q : atLogo;
});
const resolvedClosed = computed(() => {
  const q = route.query.closed as string | undefined;
  return q && q.length ? q : atClosed;
});
const resolvedOpened = computed(() => {
  const q = route.query.opened as string | undefined;
  return q && q.length ? q : atOpened;
});

// Посилання офферу
const offerUrl = "https://planetcode.today";

// Німецькі тексти за замовчанням (можна перевизначити query)
const gameSettings = {
  ui: {
    title: (route.query.title as string) || "Öffne das Paket",
    tapHint: (route.query.hint as string) || "Tippe, um zu öffnen",
    claimButton: (route.query.claim as string) || "Bonus abholen",
    nothingLabel: (route.query.nothing as string) || "Nichts",
    bonusLabel: (route.query.bonus as string) || "Bonus",
    fsLabel: (route.query.fslabel as string) || "FS",
    remainingLabel: (route.query.remaining as string) || "Verbleibende Pakete",
    winModalTitle: (route.query.winTitle as string) || "GEWINN!",
    winModalCongratulations:
      (route.query.winCongrats as string) || "Glückwunsch!",
    gameCompletedTitle: (route.query.doneTitle as string) || "SPIEL BEENDET!",
    gameCompletedSubtitle:
      (route.query.doneSub as string) || "Glückwunsch zum Gewinn!",
    totalBonusesLabel: (route.query.totalBonus as string) || "Gesamtbonus",
    totalFreeSpinsLabel: (route.query.totalFs as string) || "Gesamt-Freispiele",
    bonusesLabel: (route.query.bonuses as string) || "Bonus",
    freeSpinsLabel: (route.query.freeSpins as string) || "Freispiele",
    loaderText: (route.query.loader as string) || "LADEN...",
    currencySymbolMap: { EUR: "€", USD: "$", PLN: "zł", UAH: "₴" },
  },
  currency: ((route.query.curr as string) || "EUR") as
    | "EUR"
    | "USD"
    | "PLN"
    | "UAH",
  bonusAmount: Number(route.query.bonusAmount ?? 500),
  fsQuantity: Number(route.query.fsQty ?? 250),
  packsCount: Number(route.query.packs ?? 5),
  openingDurationMs: Number(route.query.duration ?? 1000),
  dropChances: {
    nothing: Number(route.query.pNothing ?? 0.5),
    bonus: Number(route.query.pBonus ?? 0.3),
    fs: Number(route.query.pFs ?? 0.2),
  },
  bonusPerDropRange: [
    Number(route.query.minBonus ?? 20),
    Number(route.query.maxBonus ?? 180),
  ] as [number, number],
  fsPerDropRange: [
    Number(route.query.minFs ?? 5),
    Number(route.query.maxFs ?? 30),
  ] as [number, number],
};

const onGameCompleted = (_r: any) => {};
const onRewardsClaimed = (_r: any) => {};
</script>
