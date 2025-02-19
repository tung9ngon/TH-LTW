import { useState } from "react";
import { Input, Button, Card } from "antd";
import "antd/dist/antd.css"; // Import toàn bộ style của antd

export default function GuessNumberGame() {
  const [targetNumber, setTargetNumber] = useState(generateRandomNumber());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Hãy đoán một số từ 1 đến 100");
  const [attempts, setAttempts] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  function handleGuess() {
    if (gameOver) return;
    
    const userGuess = parseInt(guess, 10);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setMessage("Vui lòng nhập một số hợp lệ từ 1 đến 100");
      return;
    }

    if (userGuess === targetNumber) {
      setMessage("Chúc mừng! Bạn đã đoán đúng!");
      setGameOver(true);
    } else if (userGuess < targetNumber) {
      setMessage("Bạn đoán quá thấp!");
    } else {
      setMessage("Bạn đoán quá cao!");
    }

    setAttempts((prev) => prev - 1);
    if (attempts - 1 === 0 && userGuess !== targetNumber) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${targetNumber}`);
      setGameOver(true);
    }
  }

  function restartGame() {
    setTargetNumber(generateRandomNumber());
    setGuess("");
    setMessage("Hãy đoán một số từ 1 đến 100");
    setAttempts(10);
    setGameOver(false);
  }

  return (
    <Card title="Trò chơi đoán số" className="max-w-md mx-auto text-center" style={{ padding: "1rem" }}>
      <p className="my-4">{message}</p>
      <Input
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={gameOver}
      />
      <Button className="mt-2" onClick={handleGuess} disabled={gameOver}>
        Đoán
      </Button>
      <p className="mt-2">Lượt còn lại: {attempts}</p>
      {gameOver && (
        <Button className="mt-4" onClick={restartGame}>
          Chơi lại
        </Button>
      )}
    </Card>
  );
}
