import { createRouter, createWebHistory } from 'vue-router'
import Wheel from '@/views/Wheel.vue'
import WheelGreen from '@/views/WheelGreen.vue'
import WheelRed from '@/views/WheelRed.vue'
import WheelPurple from '@/views/WheelPurple.vue'
import WheelFdj from '@/views/WheelFdj.vue'
import WheelGuraFRFDJ from '@/views/WheelGuraFRFDJ.vue'
import WheelPhantomGR from '@/views/WheelPhantomGR.vue'
import WheelRudikGR from '@/views/WheelRudikGR.vue'
import FrScratchView from '@/views/FrScratchView.vue'
import FrCasesView from '@/views/FrCasesView.vue'
import ItCasesPhantom from '@/views/ItCasesPhantom.vue'
import ItCasesPhantom2 from '@/views/ItCasesPhantom2.vue'
import PackageOpeningView from '@/views/ITAlexeyPackageView.vue'
import PlPackageKozak from '@/views/PlPackageKozak.vue'
import ItPackageGordey from '@/views/ItPackageGordey.vue'
import ItPackageAndr1 from '@/views/ItPackageAndr1.vue'
import ItPackageAndr2 from '@/views/ItPackageAndr2.vue'
import PlPackageAndr from '@/views/PlPackageAndr.vue'
import PlPackageAlexey from '@/views/PlPackageAlexey.vue'
import PackageOpeningView2 from '@/views/PackageOpeningView2.vue'
import PackageOpeningView3 from '@/views/PackageOpeningView3.vue'
import AtDimassPackageViewSpinbara from '@/views/AtDimassPackageViewSpinbara.vue'
import AtDimassPackageViewMafia from '@/views/AtDimassPackageViewMafia.vue'
import CashBackView from '@/views/CashBackView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Wheel,
  },
  {
    path: '/mX7pQw3R',
    name: 'WheelOrange',
    component: Wheel,
  },
  {
    path: '/gR8nF0rT',
    name: 'WheelGreen',
    component: WheelGreen,
  },
  {
    path: '/rEdF1rE9',
    name: 'WheelRed',
    component: WheelRed,
  },
  {
    path: '/pUrP7eK1',
    name: 'WheelPurple',
    component: WheelPurple,
  },
  {
    path: '/pVGjks4f',
    name: 'WheelPurple',
    component: WheelFdj,
  },
  {
    path: '/gUr4FrFdJ9',
    name: 'WheelGuraFRFDJ',
    component: WheelGuraFRFDJ,
  },
  {
    path: '/pHnT0mGr7',
    name: 'WheelPhantomGR',
    component: WheelPhantomGR,
  },
  {
    path: '/rUd1kGr8',
    name: 'WheelRudikGR',
    component: WheelRudikGR,
  },
  {
    path: '/GKz3rSc7-fr',
    name: 'FrScratchLanding',
    component: FrScratchView,
  },
  {
    path: '/GKx2bOz7-fr',
    name: 'FrCasesLanding',

    component: FrCasesView,
  },
  {
    path: '/pBo9tHm3-it',
    name: 'ItCasesPhantom',
    component: ItCasesPhantom,
  },
  {
    path: '/pBo5tHm4-it',
    name: 'ItCasesYura',
    component: ItCasesPhantom2,
  },
  {
    path: '/pAcK4gE0pEn1nG',
    name: 'ITAlexeyPackageView',
    component: PackageOpeningView,
  },
  {
    path: '/pAcK4gE0pEn1nG-pl',
    name: 'PlPackageKozak',
    component: PlPackageKozak,
  },
  {
    path: '/pAcK4gE0pEn1nG-it-gordey',
    name: 'ItPackageGordey',
    component: ItPackageGordey,
  },
  {
    path: '/pAcK4gE0pEn1nG-it-a1',
    name: 'ItPackageAndr1',
    component: ItPackageAndr1,
  },
  {
    path: '/pAcK4gE0pEn1nG-it-a2',
    name: 'ItPackageAndr2',
    component: ItPackageAndr2,
  },
  {
    path: '/pAcK4gE0pEn1nG-pl-a',
    name: 'PlPackageAndr',
    component: PlPackageAndr,
  },
  {
    path: '/gierkiCasino',
    name: 'PlPackageAlexey',
    component: PlPackageAlexey,
  },
  {
    path: '/pAcK4gE0pEn2nG',
    name: 'PackageOpeningYura',
    component: PackageOpeningView2,
  },
  {
    path: '/pAcK4gE0pEn3nG',
    name: 'PackageOpeningPhantom',
    component: PackageOpeningView3,
  },
  {
    path: '/packageATbonuSS',
    name: 'AtDimassPackageViewSpinbara',
    component: AtDimassPackageViewSpinbara,
  },
  {
    path: '/packageATbonuSSM2f1a',
    name: 'AtDimassPackageViewMafia',
    component: AtDimassPackageViewMafia,
  },
  {
    path: '/cash-back',
    name: 'CashBack',
    component: CashBackView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
