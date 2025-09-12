import { createRouter, createWebHistory } from 'vue-router'
import Wheel from '@/views/Wheel.vue'
import WheelGreen from '@/views/WheelGreen.vue'
import WheelRed from '@/views/WheelRed.vue'
import WheelPurple from '@/views/WheelPurple.vue'
import WheelFdj from '@/views/WheelFdj.vue'
import WheelGuraFRFDJ from '@/views/WheelGuraFRFDJ.vue'
import WheelPhantomGR from '@/views/WheelPhantomGR.vue'
import WheelRudikGR from '@/views/WheelRudikGR.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
