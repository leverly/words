import React, { useState, useEffect } from 'react';
import './App.css';
import levels from './words';

interface Card {
  id: number;
  content: string;
  type: 'word' | 'meaning';
  isFlipped: boolean;
  isMatched: boolean;
}

interface Word {
  id: number;
  word: string;
  meaning: string;
}

interface Level {
  name: string;
  words: Word[];
}

function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorWordIds, setErrorWordIds] = useState<number[]>([]);
  const [reviewLevelCreated, setReviewLevelCreated] = useState(false);

  // 初始化卡片
  useEffect(() => {
    if (currentLevel >= levels.length) {
      setGameComplete(true);
      return;
    }

    const levelWords = levels[currentLevel].words;
    let allCards: Card[] = [];

    // 创建单词和含义卡片
    levelWords.forEach(word => {
      allCards.push({
        id: word.id * 2 - 1,
        content: word.word,
        type: 'word',
        isFlipped: false,
        isMatched: false
      });
      allCards.push({
        id: word.id * 2,
        content: word.meaning,
        type: 'meaning',
        isFlipped: false,
        isMatched: false
      });
    });

    // 随机排序卡片
    allCards = allCards.sort(() => Math.random() - 0.5);
    setCards(allCards);
    setGameOver(false);
    setSelectedCard(null);
    setIsProcessing(false);
  }, [currentLevel]);

  // 处理卡片点击
  const handleCardClick = (clickedCard: Card) => {
    if (gameOver || clickedCard.isFlipped || clickedCard.isMatched || isProcessing) {
      return;
    }

    // 翻转卡片
    const updatedCards = cards.map(card => 
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    // 如果是第一张选中的卡片
    if (!selectedCard) {
      setSelectedCard(clickedCard);
      return;
    }

    // 如果是第二张选中的卡片
    setIsProcessing(true);
    const selectedWordId = Math.ceil(selectedCard.id / 2);
    const clickedWordId = Math.ceil(clickedCard.id / 2);

    // 检查是否匹配
    if (selectedWordId === clickedWordId && selectedCard.type !== clickedCard.type) {
      // 匹配成功
      setTimeout(() => {
        // 标记匹配的卡片
        const matchedCards = updatedCards.map(card => 
          Math.ceil(card.id / 2) === selectedWordId
            ? { ...card, isMatched: true } : card
        );
        setCards(matchedCards);
        setSelectedCard(null);
        setIsProcessing(false);

        // 检查是否完成当前关卡
        if (matchedCards.every(card => card.isMatched)) {
          // 显示撒花动效
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            if (currentLevel + 1 >= levels.length) {
              // 所有关卡完成，检查是否有错误单词需要复习
              if (errorWordIds.length > 0 && !reviewLevelCreated) {
                createReviewLevel();
              } else {
                setGameComplete(true);
              }
            } else {
              setCurrentLevel(prev => prev + 1);
            }
          }, 2000);
        }
      }, 500);
    } else {
      // 匹配失败
      setErrors(prev => prev + 1);

      // 记录错误的单词ID
      if (selectedWordId !== clickedWordId) {
        setErrorWordIds(prev => [...prev, selectedWordId, clickedWordId]);
      }

      // 翻转回卡片
      setTimeout(() => {
        const resetCards = updatedCards.map(card => 
          card.id === selectedCard.id || card.id === clickedCard.id
            ? { ...card, isFlipped: false } : card
        );
        setCards(resetCards);
        setSelectedCard(null);
        setIsProcessing(false);

        // 移除最多5次错误的限制，只记录错误不结束游戏
      }, 700);
    }
  };

  // 创建复习关卡
  const createReviewLevel = () => {
    // 去重错误单词ID
    const uniqueErrorIds = Array.from(new Set(errorWordIds));
    let reviewWords: Word[] = [];
    let allWords: Word[] = [];

    // 收集所有单词
    levels.forEach(level => {
      allWords = [...allWords, ...level.words];
    });

    // 收集错误单词
    allWords.forEach(word => {
      if (uniqueErrorIds.includes(word.id) && reviewWords.length < 6) {
        reviewWords.push(word);
      }
    });

    // 如果不足6个单词（12张卡片），则用其他单词填充
    if (reviewWords.length < 6) {
      allWords.forEach(word => {
        if (!uniqueErrorIds.includes(word.id) && reviewWords.length < 6) {
          reviewWords.push(word);
        }
      });
    }

    // 创建复习关卡
    const reviewLevel: Level = {
      name: "Review Level",
      words: reviewWords
    };

    // 添加到levels数组
    (levels as Level[]).push(reviewLevel);
    setReviewLevelCreated(true);
    // 进入复习关卡
    setCurrentLevel(levels.length - 1);
  };

  // 重新开始游戏
  const restartGame = () => {
    setCurrentLevel(0);
    setGameComplete(false);
    setErrors(0);
    setErrorWordIds([]);
    setReviewLevelCreated(false);
    // 移除复习关卡
    if (levels.length > (levels as Level[]).filter(l => l.name !== "Review Level").length) {
      (levels as Level[]).pop();
    }
  };

  // 重试当前关卡
  const retryLevel = () => {
    setCurrentLevel(currentLevel);
  };

  // 渲染卡片
  const renderCard = (card: Card) => {
    let cardClass = 'card';
    if (card.isMatched) {
      cardClass += ' matched';
    }
    if (card.type === 'word') {
      cardClass += ' word';
    } else {
      cardClass += ' meaning';
    }
    if (card.isFlipped) {
      cardClass += ' selected';
    }

    return (
      <div
        key={card.id}
        className={cardClass}
        onClick={() => handleCardClick(card)}
        aria-label={card.content}
      >
        <div className="card-content">
          {card.content}
        </div>
      </div>
    );
  };

  // 计算进度百分比
  const progressPercentage = currentLevel / levels.length * 100;

  return (
    <div className="App">
      <div className="background-pattern" />
      <div className={`game-container ${currentLevel === levels.length - 1 && reviewLevelCreated ? 'level-review' : `level-${currentLevel}`}`}>
        {gameComplete ? (
          <div className="game-complete">
            <h1>Congratulations!</h1>
            <p>You have successfully completed all levels with {errors} errors!</p>
            <button onClick={restartGame}>Play Again</button>
          </div>
        ) : gameOver ? (
          <div className="game-over">
            <h1>Game Over</h1>
            <p>You have reached the maximum number of errors (5). Try again!</p>
            <button onClick={retryLevel}>Retry Level</button>
            <button onClick={restartGame}>Restart Game</button>
          </div>
        ) : (
          <>
            <div className="game-header">
            <h1>Word Matching Game</h1>
            <div className="game-info">
              <p>Level: <span>{levels[currentLevel]?.name || 'All levels completed'}</span></p>
              <p>Errors: <span>{errors}</span></p>
            </div>
            <div className="level-progress">
              <div
                className="progress-bar"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
            <div className="card-grid">
              {cards.map(renderCard)}
            </div>
          </>
        )}
        {/* 撒花动效 */}
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(150)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
