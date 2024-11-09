import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Snake Game Component
const SnakeGame: React.FC<{ onGameOver: () => void }> = ({ onGameOver }) => {
  const [snake, setSnake] = useState<{ x: number, y: number }[]>([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState<string>('RIGHT');
  const [food, setFood] = useState<{ x: number, y: number }>({ x: 10, y: 10 });
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const gridSize = 15;

  useEffect(() => {
    if (gameOver) return onGameOver();

    const interval = setInterval(() => {
      moveSnake();
    }, 200);

    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    let head = { ...newSnake[0] };

    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    newSnake.unshift(head);

    // Check collision with food
    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      generateFood();
    } else {
      newSnake.pop();
    }

    // Check collision with walls or itself
    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      newSnake.slice(1).some(s => s.x === head.x && s.y === head.y)
    ) {
      setGameOver(true);
    }

    setSnake(newSnake);
  };

  const generateFood = () => {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    setFood({ x, y });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowUp' && direction !== 'DOWN') setDirection('UP');
    if (e.key === 'ArrowDown' && direction !== 'UP') setDirection('DOWN');
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') setDirection('LEFT');
    if (e.key === 'ArrowRight' && direction !== 'LEFT') setDirection('RIGHT');
  };

  return (
    <GameContainer onKeyDown={handleKeyPress} tabIndex={0}>
      <h2>Snake Game - Score: {score}</h2>
      <Grid>
        {Array.from({ length: gridSize }).map((_, rowIndex) => (
          <Row key={rowIndex}>
            {Array.from({ length: gridSize }).map((_, colIndex) => {
              const isSnake = snake.some(s => s.x === colIndex && s.y === rowIndex);
              const isFood = food.x === colIndex && food.y === rowIndex;
              return (
                <Cell key={colIndex} isSnake={isSnake} isFood={isFood} />
              );
            })}
          </Row>
        ))}
      </Grid>
      {gameOver && <GameOverMessage>Game Over! Final Score: {score}</GameOverMessage>}
    </GameContainer>
  );
};

// Pong Game Component
const PongGame: React.FC<{ onGameOver: () => void }> = ({ onGameOver }) => {
  return (
    <GameContainer>
      <h2>Pong Game (coming soon!)</h2>
    </GameContainer>
  );
};

// Tetris Game Component
const TetrisGame: React.FC<{ onGameOver: () => void }> = ({ onGameOver }) => {
  return (
    <GameContainer>
      <h2>Tetris Game (coming soon!)</h2>
    </GameContainer>
  );
};

// Pomodoro Timer Component
const PomodoroTimer: React.FC<{ onBreakEnd: () => void }> = ({ onBreakEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number>(5 * 60); // 5 minutes for break
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onBreakEnd();
            return 5 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, onBreakEnd]);

  const startStopTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(5 * 60); // Reset to 5-minute break
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <PomodoroContainer>
      <h2>Break Time</h2>
      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>
      <TimerControls>
        <button onClick={startStopTimer}>{isActive ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer}>Reset</button>
      </TimerControls>
    </PomodoroContainer>
  );
};

// Break Component
const Break: React.FC = () => {
  const [gameIndex, setGameIndex] = useState<number>(0); // Controls which game to show
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGameOver = () => {
    setGameOver(true);
  };

  const handleBreakEnd = () => {
    setGameOver(true);
    alert("Time To WORK!!!");
  };

  useEffect(() => {
    if (gameOver) {
      setTimeout(() => {
        setGameOver(false);
        setGameIndex((prev) => (prev + 1) % 3); // Cycle through games
      }, 1000);
    }
  }, [gameOver]);

  return (
    <BreakContainer>
      <PomodoroTimer onBreakEnd={handleBreakEnd} />
      {gameIndex === 0 && !gameOver && <SnakeGame onGameOver={handleGameOver} />}
      {gameIndex === 1 && !gameOver && <PongGame onGameOver={handleGameOver} />}
      {gameIndex === 2 && !gameOver && <TetrisGame onGameOver={handleGameOver} />}
      {gameOver && <GameOverMessage>Game Over! Next Game Loading...</GameOverMessage>}
    </BreakContainer>
  );
};

// Styled Components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(15, 20px);
  grid-template-columns: repeat(15, 20px);
  gap: 1px;
  margin: 20px 0;
`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.div<{ isSnake: boolean, isFood: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ isSnake, isFood }) => (isSnake ? '#2ecc71' : isFood ? '#e74c3c' : '#ecf0f1')};
`;

const TimerDisplay = styled.div`
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const TimerControls = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const PomodoroContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GameOverMessage = styled.div`
  font-size: 18px;
  color: #e74c3c;
`;

const BreakContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #fafafa;
`;

export default Break;