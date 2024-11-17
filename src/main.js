import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import { 
  faHome, 
  faUser, 
  faTv, 
  faFilm, 
  faCloud, 
  faVideo,
  faGift,
  faPlay,
  faStar,
  faChild,
  faDragon,
  faPhotoVideo,
  faFire,
  faClock,
  faPlayCircle,
  faAngleRight,
  faInfoCircle,
  faSearch,
  faBell,
  faChevronDown,
  faHistory,
  faHeart,
  faSignOutAlt,
  faCrown,
  faCoins,
  faCheckCircle,
  faTimesCircle,
  faReceipt,
  faCog,
  faTrash,
  faCheck,
  faEye,
  faThumbsUp,
  faFlag,
  faShare,
  faPlus,
  faThLarge,
  faList,
  faImage,
  faFilter,
  faSortAmountDown,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

library.add(
  faHome, 
  faUser, 
  faTv, 
  faFilm, 
  faCloud, 
  faVideo,
  faGift,
  faPlay,
  faStar,
  faChild,
  faDragon,
  faPhotoVideo,
  faFire,
  faClock,
  faPlayCircle,
  faAngleRight,
  faInfoCircle,
  faSearch,
  faBell,
  faChevronDown,
  faHistory,
  faHeart,
  faSignOutAlt,
  faCrown,
  faCoins,
  faCheckCircle,
  faTimesCircle,
  faReceipt,
  faCog,
  faTrash,
  faCheck,
  faEye,
  faThumbsUp,
  faFlag,
  faShare,
  faPlus,
  faThLarge,
  faList,
  faImage,
  faFilter,
  faSortAmountDown,
  faLayerGroup
)
 
const app = createApp(App)

app.use(ElementPlus)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.mount('#app')
