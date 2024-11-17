// 基础图片路径（使用稳定的图片链接）
const defaultImages = {
  // 热门推荐的电影海报
  posters: {
    // 电影
    oppenheimer: 'https://www.themoviedb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',   // 奥本海默
    barbie: 'https://www.themoviedb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',       // 芭比
    changan: 'https://www.themoviedb.org/t/p/w500/qEm4FrkGh7kGoEiBOyGYNielYVc.jpg',      // 长安三万里
    wonka: 'https://www.themoviedb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',        // 旺卡
    
    // 热门剧集
    succession: 'https://www.themoviedb.org/t/p/w500/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg',    // 继承之战
    wednesday: 'https://www.themoviedb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',     // 星期三
    witcher: 'https://www.themoviedb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',      // 猎魔人
    mandalorian: 'https://www.themoviedb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',   // 曼达洛人
  },
  
  // 最新上线的剧集海报
  latest: {
    // 新上线剧集
    santi: 'https://www.themoviedb.org/t/p/w500/nGwFsB6EXUCr21wzPgtP5juZPSv.jpg',        // 三体
    kuangbiao: 'https://www.themoviedb.org/t/p/w500/44immBwzhDVyjn87b3x3l9mlhAD.jpg',     // 狂飙
    heian: 'https://www.themoviedb.org/t/p/w500/6jxTQhGA1rBXwpgZRP3YhZBQlGJ.jpg',        // 黑暗荣耀
    lastofus: 'https://www.themoviedb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',     // 最后生还者
    house: 'https://www.themoviedb.org/t/p/w500/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg',        // 龙之家族
    bear: 'https://www.themoviedb.org/t/p/w500/b3zVRZ9R2QyV0klRESMLKaBwPqH.jpg',         // 熊家餐馆
    ted: 'https://www.themoviedb.org/t/p/w500/kTQzD9D7tJxjzXhnwX4BEZxoqJx.jpg',          // 泰迪熊
    fargo: 'https://www.themoviedb.org/t/p/w500/xDI2YzfFwxR889qv8v5a5ksEQNr.jpg'         // 冰血暴
  },
  
  // 背景大图（剧照）
  backdrops: {
    oppenheimer: 'https://www.themoviedb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    barbie: 'https://www.themoviedb.org/t/p/original/nHf61UzkfFno5X1ofIhugCPus2R.jpg',
    succession: 'https://www.themoviedb.org/t/p/original/7HW47XbkNQ5fiwQFYGWdw9gs144.jpg'
  },
  
  // 默认占位图
  placeholder: 'https://www.themoviedb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'
}

// 轮播图数据
export const bannerItems = [
  {
    id: 1,
    title: '奥本海默',
    description: '诺兰执导，基里安·墨菲主演，讲述了"原子弹之父"罗伯特·奥本海默的传奇一生。一个关于道德与科学，战争与和平的史诗级传记电影。',
    image: defaultImages.backdrops.oppenheimer,
    rating: '9.3',
    year: '2023',
    category: '传记',
    tags: ['传记', '历史', '剧情']
  },
  {
    id: 2,
    title: '芭比',
    description: '格蕾塔·葛韦格执导，玛格特·罗比主演。芭比在完美世界过着完美生活，直到她开始思考生命的意义，并决定前往真实世界寻找答案。',
    image: defaultImages.backdrops.barbie,
    rating: '8.8',
    year: '2023',
    category: '喜剧',
    tags: ['喜剧', '奇幻', '冒险']
  },
  {
    id: 3,
    title: '继承之战',
    description: 'HBO王牌剧集最终季，罗伊家族围绕着媒体帝国继承权展开的终极对决。一场关于权力、欲望与背叛的当代莎士比亚式悲剧。',
    image: defaultImages.backdrops.succession,
    rating: '9.5',
    year: '2023',
    category: '剧情',
    tags: ['剧情', '家族', '商战']
  }
]

// 热门推荐数据
export const tvShowsList = [
  {
    id: 1,
    title: '继承之战 第四季',
    poster: defaultImages.posters.succession,
    rating: '9.5',
    year: 2023,
    episodes: 10,
    tags: ['剧情', '家族', '商战'],
    views: 3500000,
    likes: 1800000,
    quality: '4K',
    description: 'HBO年度压轴巨制，罗伊家族的最终对决。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-21'
  },
  {
    id: 2,
    title: '星期三',
    poster: defaultImages.posters.wednesday,
    rating: '8.9',
    year: 2023,
    episodes: 8,
    tags: ['奇幻', '悬疑', '青春'],
    views: 2800000,
    likes: 1500000,
    quality: '4K',
    description: '蒂姆·波顿打造的亚当斯一家衍生剧。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-20'
  },
  {
    id: 3,
    title: '猎魔人 第三季',
    poster: defaultImages.posters.witcher,
    rating: '8.7',
    year: 2023,
    episodes: 8,
    tags: ['奇幻', '动作', '冒险'],
    views: 2200000,
    likes: 1100000,
    quality: '4K',
    description: '改编自安杰伊·萨普科夫斯基的奇幻小说。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-19'
  },
  {
    id: 4,
    title: '曼达洛人 第三季',
    poster: defaultImages.posters.mandalorian,
    rating: '8.9',
    year: 2023,
    episodes: 8,
    tags: ['科幻', '动作', '冒险'],
    views: 2000000,
    likes: 950000,
    quality: '4K',
    description: '星球大战系列剧集。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-18'
  },
  {
    id: 5,
    title: '旺卡',
    poster: defaultImages.posters.wonka,
    rating: '8.7',
    year: 2023,
    episodes: null,
    tags: ['奇幻', '冒险', '喜剧'],
    views: 2100000,
    likes: 980000,
    quality: '4K',
    description: '讲述年轻的威利·旺卡的奇幻冒险故事。',
    category: '电影',
    region: 'american',
    updateTime: '2024-03-17'
  },
  {
    id: 6,
    title: '长安三万里',
    poster: defaultImages.posters.changan,
    rating: '9.2',
    year: 2023,
    episodes: null,
    tags: ['动画', '历史', '文化'],
    views: 2400000,
    likes: 1200000,
    quality: '4K',
    description: '国产动画电影，展现盛唐风采。',
    category: '电影',
    region: 'chinese',
    updateTime: '2024-03-16'
  },
  {
    id: 7,
    title: '芭比',
    poster: defaultImages.posters.barbie,
    rating: '8.8',
    year: 2023,
    episodes: null,
    tags: ['喜剧', '奇幻', '冒险'],
    views: 2800000,
    likes: 1500000,
    quality: '4K',
    description: '格蕾塔·葛韦格执导，玛格特·罗比主演。',
    category: '电影',
    region: 'american',
    updateTime: '2024-03-15'
  },
  {
    id: 8,
    title: '奥本海默',
    poster: defaultImages.posters.oppenheimer,
    rating: '9.3',
    year: 2023,
    episodes: null,
    tags: ['传记', '历史', '剧情'],
    views: 3200000,
    likes: 1700000,
    quality: '4K',
    description: '诺兰导演的传记电影巨制。',
    category: '电影',
    region: 'american',
    updateTime: '2024-03-14'
  }
]

// 最新上线数据
export const latestShows = [
  {
    id: 1,
    title: '三体',
    poster: defaultImages.latest.santi,
    rating: '8.9',
    year: 2024,
    episodes: 30,
    tags: ['科幻', '悬疑', '剧情'],
    views: 2500000,
    likes: 1200000,
    quality: '4K',
    description: '改编自刘慈欣的科幻小说。',
    category: '电视剧',
    region: 'chinese',
    updateTime: '2024-03-21'
  },
  {
    id: 2,
    title: '龙之家族',
    poster: defaultImages.latest.house,
    rating: '9.1',
    year: 2024,
    episodes: 10,
    tags: ['奇幻', '史诗', '冒险'],
    views: 2300000,
    likes: 1100000,
    quality: '4K',
    description: '权力的游戏前传。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-20'
  },
  {
    id: 3,
    title: '熊家餐馆',
    poster: defaultImages.latest.bear,
    rating: '9.3',
    year: 2024,
    episodes: 10,
    tags: ['剧情', '美食', '喜剧'],
    views: 1800000,
    likes: 950000,
    quality: '4K',
    description: '米其林主厨的故事。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-19'
  },
  {
    id: 4,
    title: '冰血暴 第五季',
    poster: defaultImages.latest.fargo,
    rating: '8.8',
    year: 2024,
    episodes: 10,
    tags: ['犯罪', '惊悚', '剧情'],
    views: 1600000,
    likes: 850000,
    quality: '4K',
    description: '科恩兄弟监制的犯罪剧集。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-18'
  },
  {
    id: 5,
    title: '泰迪熊',
    poster: defaultImages.latest.ted,
    rating: '8.5',
    year: 2024,
    episodes: 7,
    tags: ['喜剧', '奇幻', '搞笑'],
    views: 1500000,
    likes: 800000,
    quality: '4K',
    description: '会说话的泰迪熊的全新故事。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-17'
  },
  {
    id: 6,
    title: '最后生还者',
    poster: defaultImages.latest.lastofus,
    rating: '9.2',
    year: 2024,
    episodes: 9,
    tags: ['剧情', '生存', '冒险'],
    views: 2100000,
    likes: 1100000,
    quality: '4K',
    description: 'HBO重磅改编游戏神作。',
    category: '电视剧',
    region: 'american',
    updateTime: '2024-03-16'
  },
  {
    id: 7,
    title: '黑暗荣耀',
    poster: defaultImages.latest.heian,
    rating: '8.9',
    year: 2024,
    episodes: 8,
    tags: ['剧情', '复仇', '悬疑'],
    views: 1900000,
    likes: 950000,
    quality: '4K',
    description: '韩国复仇题材神作。',
    category: '电视剧',
    region: 'korean',
    updateTime: '2024-03-15'
  },
  {
    id: 8,
    title: '狂飙',
    poster: defaultImages.latest.kuangbiao,
    rating: '9.0',
    year: 2024,
    episodes: 39,
    tags: ['犯罪', '剧情', '动作'],
    views: 2600000,
    likes: 1300000,
    quality: '4K',
    description: '国产警匪剧巅峰之作。',
    category: '电视剧',
    region: 'chinese',
    updateTime: '2024-03-14'
  }
]

// 导出默认图片，以便在其他地方使用
export const defaultImage = defaultImages.placeholder

// 导出图片集合
export const images = defaultImages 