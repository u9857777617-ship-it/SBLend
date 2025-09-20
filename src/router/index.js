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

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Wheel
  },
  {
    path: '/mX7pQw3R',
    name: 'WheelOrange',
    component: Wheel
  },
  {
    path: '/gR8nF0rT',
    name: 'WheelGreen',
    component: WheelGreen
  },
  {
    path: '/rEdF1rE9',
    name: 'WheelRed',
    component: WheelRed
  },
  {
    path: '/pUrP7eK1',
    name: 'WheelPurple',
    component: WheelPurple
  },
  {
    path: '/pVGjks4f',
    name: 'WheelPurple',
    component: WheelFdj
  },
  {
    path: '/gUr4FrFdJ9',
    name: 'WheelGuraFRFDJ',
    component: WheelGuraFRFDJ
  },
  {
    path: '/pHnT0mGr7',
    name: 'WheelPhantomGR',
    component: WheelPhantomGR
  },
  {
    path: '/rUd1kGr8',
    name: 'WheelRudikGR',
    component: WheelRudikGR
  },
  {
    path: '/GKz3rSc7-fr',
    name: 'FrScratchLanding',
    component: FrScratchView
  },
  {
    path: '/aNd1kSr8-fr',
    name: 'FrScratchLanding',
    component: FrScratchView
  },
  {
    path: '/pHa1sTr8-fr',
    name: 'FrScratchLanding',
    component: FrScratchView
  },
  {
    path: '/GKx2bOz7-fr',
    name: 'FrCasesLanding',
    component: FrCasesView
  },
  {
    path: '/aBx9dR3-fr',
    name: 'FrCasesLanding',
    component: FrScratchView
  },
  {
    path: '/pBo9tHm3-fr',
    name: 'FrCasesLanding',
    component: FrScratchView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
