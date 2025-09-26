<template>
  <div class="slot-machine-view">
    <SlotMachineGame
      :colorScheme="colorScheme"
      :texts="texts"
      :gameSettings="gameSettings"
      :offerUrl="offerUrl"
      :logoSrc="logoSrc"
      @game-completed="onGameCompleted"
      @bonus-claimed="onBonusClaimed"
    />
  </div>
</template>

<script setup lang="ts">
import SlotMachineGame from "@/components/SlotMachineGame.vue";

const colorScheme = {
  primary: "#1a237e",
  secondary: "#3949ab",
  accent: "#5c6bc0",
  background: "linear-gradient(135deg, #0f1419 0%, #1a237e 50%, #3949ab 100%)",
};

const texts = {
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
};

const gameSettings = {
  totalSpins: 15,
  minWinAmount: 0.5,
  maxWinAmount: 25.0,
  minFreeSpins: 5,
  maxFreeSpins: 50,
  winProbability: 0.6, // 60% chance to win money
  freeSpinsProbability: 0.4, // 40% chance to get free spins
  moneyToWin: 100.0, // Гарантована сума грошей за всю гру
  FSQuantity: 100, // Гарантована кількість фріспінів за всю гру
};

const offerUrl = "https://example.com";
const logoSrc = new URL("../assets/fdjLogo.png", import.meta.url).href;

const onGameCompleted = (result: any) => {
  console.log("Slot game completed:", result);
  // Here you can send analytics or do other actions
};

const onBonusClaimed = (bonuses: any) => {
  console.log("Bonuses claimed:", bonuses);
  // Here you can track bonus claims
};
</script>

<style scoped>
.slot-machine-view {
  width: 100%;
  min-height: 100vh;
}
</style>
