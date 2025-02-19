import React, { useState } from 'react';
import { Input, Button, Typography, Card, Layout } from 'antd';
import 'antd/dist/antd.css';


const { Title } = Typography;
const { Content } = Layout;

const App: React.FC = () => {
    const [secretNumber, setSecretNumber] = useState(Math.floor(Math.random() * 100) + 1);
    const [attempts, ] = useState(10);
    const [currentAttempt, setCurrentAttempt] = useState(0);
    const [guess, setGuess] = useState<number | undefined>(undefined);
    const [gameOver, setGameOver] = useState(false);
    const [message,setMessage] = useState<string>("");

    const handleGuess = () => {
        if (guess === undefined || guess < 1 || guess > 100) {
            setMessage("Vui lòng nhập một số trong khoảng từ 1 đến 100.");
            return;
        }

        setCurrentAttempt(currentAttempt + 1);

        if (guess < secretNumber) {
            setMessage("Bạn đoán quá thấp!");
        } else if (guess > secretNumber) {
            setMessage("Bạn đoán quá cao!");
        } else {
            setMessage("Chúc mừng! Bạn đã đoán đúng!");
            setGameOver(true);
            return;
        }

        if (currentAttempt + 1 >= attempts) {
            setMessage(`Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
            setGameOver(true);
        }

        setGuess(undefined);
    };

    const resetGame = () => {
        setSecretNumber(Math.floor(Math.random() * 100) + 1);
        setCurrentAttempt(0); 
        setGuess(undefined); 
        setGameOver(false); 
    };

    return (
        <Layout style={{ minHeight: '100%', backgroundColor: 'rgb(249, 244, 244)' }}>
            <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card style={{ width: 600, textAlign: 'center', borderRadius: '10px', boxShadow: '0 4px 8px rgba(24, 22, 22, 0.1)' }}>
                    <Title level={2}>Trò Chơi Đoán Số</Title>
                    <p>Tôi đã chọn một số ngẫu nhiên từ 1 đến 100.</p>
                    <p>Bạn còn <b>{attempts - currentAttempt}</b> lượt để đoán số này.</p>
                    <Input
                        type="number"
                        min={1}
                        max={100}
                        value={guess}
                        onChange={(e) => setGuess(Number(e.target.value))}
                        placeholder="Nhập số của bạn"
                        style={{ width: '100%', marginBottom: '20px' }}
                    />
                    <p><b>{message}</b></p>
                    <Button 
                        type="primary" 
                        onClick={handleGuess}
disabled={currentAttempt >= attempts || gameOver}
                        style={{ borderRadius:'1000%', backgroundColor:"red" }}
                    >
                        Đoán
                    </Button>
                    {gameOver && (
                        <Button 
                            type="default" 
                            onClick={resetGame}
                            style={{ marginLeft:'10px',color:"red" , borderRadius:'100%' }}
                        >
                            Chơi lại
                        </Button>
                    )}
                </Card>
            </Content>
        </Layout>
    );
};

export default App;
