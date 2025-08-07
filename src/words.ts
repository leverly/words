interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface Level { 
  id: number;
  name: string;
  words: Word[];
}

const levels: Level[] = [
  {
    id: 1,
    name: "Beginner",
    words: [
      { id: 1, word: "apple", meaning: "苹果" },
      { id: 2, word: "banana", meaning: "香蕉" },
      { id: 3, word: "cat", meaning: "猫" },
      { id: 4, word: "dog", meaning: "狗" },
      { id: 5, word: "egg", meaning: "鸡蛋" },
      { id: 6, word: "fish", meaning: "鱼" },
    ]
  },
  {
    id: 2,
    name: "Intermediate",
    words: [
      { id: 7, word: "happy", meaning: "开心的" },
      { id: 8, word: "sad", meaning: "悲伤的" },
      { id: 9, word: "angry", meaning: "生气的" },
      { id: 10, word: "excited", meaning: "兴奋的" },
      { id: 11, word: "tired", meaning: "疲倦的" },
      { id: 12, word: "hungry", meaning: "饥饿的" },
    ]
  },
  {
    id: 3,
    name: "Advanced",
    words: [
      { id: 13, word: "beautiful", meaning: "美丽的" },
      { id: 14, word: "handsome", meaning: "英俊的" },
      { id: 15, word: "clever", meaning: "聪明的" },
      { id: 16, word: "stupid", meaning: "愚蠢的" },
      { id: 17, word: "kind", meaning: "善良的" },
      { id: 18, word: "mean", meaning: "刻薄的" },
    ]
  },
  {
    id: 4,
    name: "Expert",
    words: [
      { id: 19, word: "mountain", meaning: "山" },
      { id: 20, word: "river", meaning: "河" },
      { id: 21, word: "ocean", meaning: "海洋" },
      { id: 22, word: "desert", meaning: "沙漠" },
      { id: 23, word: "forest", meaning: "森林" },
      { id: 24, word: "field", meaning: "田野" },
    ]
  },
  {
    id: 5,
    name: "Master",
    words: [
      { id: 25, word: "computer", meaning: "电脑" },
      { id: 26, word: "phone", meaning: "手机" },
      { id: 27, word: "tablet", meaning: "平板" },
      { id: 28, word: "laptop", meaning: "笔记本" },
      { id: 29, word: "camera", meaning: "相机" },
      { id: 30, word: "watch", meaning: "手表" },
    ]
  }
];

export default levels;