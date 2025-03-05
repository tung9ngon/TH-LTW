import React, { useState } from "react";

const choices = ["Kéo", "Búa", "Bao"];

interface GameHistory {
  player: string;
  computer: string;
  result: string;
}

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<GameHistory[]>([]);

  const getComputerChoice = (): string => {
    return choices[Math.floor(Math.random() * choices.length)];
  };

  const determineWinner = (player: string, computer: string): string => {
    if (player === computer) {
      return "Hòa";
    } else if (
      (player === "Kéo" && computer === "Búa") ||
      (player === "Búa" && computer === "Bao") ||
      (player === "Bao" && computer === "Kéo")
    ) {
      return "Bạn thắng";
    } else {
      return "Máy tính thắng";
    }
  };

  const handlePlayerChoice = (choice: string) => {
    const computer = getComputerChoice();
    const gameResult = determineWinner(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);
    setHistory([...history, { player: choice, computer, result: gameResult }]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-4">Trò Chơi Kéo, Búa, Bao</h1>
        <div className="flex justify-center space-x-4 mb-4">
          {choices.map((choice) => (
            <button
              key={choice}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => handlePlayerChoice(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
        {playerChoice && computerChoice && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Bạn chọn: {playerChoice}, Máy tính chọn: {computerChoice}.
            </h2>
            <h2 className="text-lg font-bold text-green-600">Kết quả: {result}</h2>
          </div>
        )}
        <h3 className="text-lg font-semibold mt-4">Lịch sử kết quả:</h3>
        <ul className="mt-2 text-left max-h-40 overflow-y-auto">
          {history.map((game, index) => (
            <li key={index} className="border-b py-1">
              Ván {index + 1}: Bạn chọn {game.player}, Máy tính chọn {game.computer} - {game.result}
            </li>
          ))}
        </ul>
        <button 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
          onClick={clearHistory}
        >
          Xóa lịch sử
        </button>
      </div>
    </div>
  );
};

export default RockPaperScissors;
