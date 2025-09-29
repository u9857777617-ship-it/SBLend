import { createRouter, createWebHistory } from "vue-router";
import Wheel from "@/views/Wheel.vue";
import WheelGreen from "@/views/WheelGreen.vue";
import WheelRed from "@/views/WheelRed.vue";
import WheelPurple from "@/views/WheelPurple.vue";
import WheelFdj from "@/views/WheelFdj.vue";
import WheelGuraFRFDJ from "@/views/WheelGuraFRFDJ.vue";
import WheelPhantomGR from "@/views/WheelPhantomGR.vue";
import WheelRudikGR from "@/views/WheelRudikGR.vue";
import FrScratchView from "@/views/FrScratchView.vue";
import FrCasesView from "@/views/FrCasesView.vue";
import ItCasesPhantom from "@/views/ItCasesPhantom.vue";
import PtCasesPhantom from "@/views/PtCasesPhantom.vue";
import PtCasesKozak from "@/views/PtCasesKozak.vue";
import PackageOpeningView from "@/views/ITAlexeyPackageView.vue";
import PlPackageKozak from "@/views/PlPackageKozak.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Wheel,
  },
  {
    path: "/mX7pQw3R",
    name: "WheelOrange",
    component: Wheel,
  },
  {
    path: "/gR8nF0rT",
    name: "WheelGreen",
    component: WheelGreen,
  },
  {
    path: "/rEdF1rE9",
    name: "WheelRed",
    component: WheelRed,
  },
  {
    path: "/pUrP7eK1",
    name: "WheelPurple",
    component: WheelPurple,
  },
  {
    path: "/pVGjks4f",
    name: "WheelPurple",
    component: WheelFdj,
  },
  {
    path: "/gUr4FrFdJ9",
    name: "WheelGuraFRFDJ",
    component: WheelGuraFRFDJ,
  },
  {
    path: "/pHnT0mGr7",
    name: "WheelPhantomGR",
    component: WheelPhantomGR,
  },
  {
    path: "/rUd1kGr8",
    name: "WheelRudikGR",
    component: WheelRudikGR,
  },
  {
    path: "/GKz3rSc7-fr",
    name: "FrScratchLanding",
    component: FrScratchView,
  },
  {
    path: "/GKx2bOz7-fr",
    name: "FrCasesLanding",
    component: FrCasesView,
  },
  {
    path: "/GKx2bOz7-pt",
    name: "PtCasesKozak",
    component: PtCasesKozak,
  },
  {
    path: "/pBo9tHm3-it",
    name: "ItCasesPhantom",
    component: ItCasesPhantom,
  },
  {
    path: "/pBo9tHm3-pt",
    name: "PtCasesPhantom",
    component: PtCasesPhantom,
  },
  {
    path: "/pAcK4gE0pEn1nG",
    name: "ITAlexeyPackageView",
    component: PackageOpeningView,
  },
  {
    path: "/pAcK4gE0pEn1nG-pl",
    name: "PlPackageKozak",
    component: PlPackageKozak,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
