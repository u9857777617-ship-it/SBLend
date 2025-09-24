<template>
  <div class="scratch-cards-view">
    <ScratchCardsGame
      :colorScheme="colorScheme"
      :texts="texts"
      :offerUrl="offerUrl"
      :logoSrc="logoSrc"
      @game-completed="onGameCompleted"
      @prizes-claimed="onPrizesClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import ScratchCardsGame from "@/components/ScratchCardsGame.vue";

const colorScheme = {
  primary: "#1a237e",
  secondary: "#3949ab",
  accent: "#5c6bc0",
  background: "linear-gradient(135deg, #1a237e 0%, #3949ab 50%, #5c6bc0 100%)",
};

const texts = {
  loader: "ЗАГРУЗКА...",
  gameTitle: "СТИРАЙ И ВЫИГРЫВАЙ",
  gameSubtitle: "Сотри все 15 карточек и найди свои призы!",
  cardsScratched: "Стерто",
  winsFound: "Выигрышей",
  scratchAllButton: "СТЕРЕТЬ ВСЕ",
  gameCompleted: "ИГРА ЗАВЕРШЕНА!",
  totalScratched: "Всего стерто",
  totalWins: "Всего выигрышей",
  yourPrizes: "ВАШИ ПРИЗЫ",
  claimButton: "ЗАБРАТЬ ПРИЗЫ",
  claimLoading: "ЗАГРУЗКА...",
};

const offerUrl = "https://example.com";
const logoSrc = new URL("../assets/fdjLogo.png", import.meta.url).href;

const onGameCompleted = (prizes: any[]) => {
  console.log("Game completed with prizes:", prizes);
};

const onPrizesClaimed = (prizes: any[]) => {
  console.log("Prizes claimed:", prizes);
  // Redirect to offer URL happens automatically in the component
};
</script>

<style scoped>
.scratch-cards-view {
  width: 100%;
  min-height: 100vh;
}
</style>
