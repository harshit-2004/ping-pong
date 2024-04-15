import React, { useEffect, useRef, useState } from 'react';
import ballImage from '../assets/fitnessBall.png'; 

function PingPongGame({ blocker1Y, blocker2Y, setBlocker1Y, setBlocker2Y, gameEngine, gameName, setWinner, user1, user2 }) {
    const ballRadius = 10;
    const blockerWidth = 10;
    const blockerHeight = 100;
    const paddleOffset = 10; 
    const canvasWidth = 800;
    const canvasHeight = 600;

    const canvasRef = useRef(null);
    const ballImageRef = useRef(null);

    const [cor, setCor] = useState([ballRadius + paddleOffset + blockerWidth, 300]);
    const [dx, setDx] = useState(10);
    const [dy, setDy] = useState(10);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        function draw() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear canvas

            // Draw ball
            ctx.drawImage(ballImageRef.current, cor[0] - ballRadius + paddleOffset, cor[1] - ballRadius, ballRadius * 2, ballRadius * 2);

            // Draw blockers
            ctx.fillStyle = 'blue';
            ctx.fillRect(paddleOffset, blocker1Y - blockerHeight / 2, blockerWidth, blockerHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(canvasWidth - blockerWidth - paddleOffset, blocker2Y - blockerHeight / 2, blockerWidth, blockerHeight);

            // Handle collision with blockers and update ball position and scores
            if (cor[0] + dx - ballRadius < blockerWidth + paddleOffset && cor[1] >= blocker1Y - blockerHeight / 2 && cor[1] <= blocker1Y + blockerHeight / 2) {
                setDx(-dx);
            } else if (cor[0] + dx + ballRadius >= canvasWidth - paddleOffset - blockerWidth && cor[1] >= blocker2Y - blockerHeight / 2 && cor[1] <= blocker2Y + blockerHeight / 2) {
                setDx(-dx);
            }

            // Handle collision with top and bottom walls
            if (cor[1] + dy > canvasHeight - ballRadius || cor[1] + dy < ballRadius) {
                setDy(-dy);
            }

            // Update ball position
            let x = cor[0] + dx;
            let y = cor[1] + dy;
            setCor([x, y]);

            // Check collision with side walls and update scores
            if (cor[0] + dx > canvasWidth - ballRadius) {
                setBlocker1Y(300);
                setBlocker2Y(300);
                setDx(-dx);
                setScore2(score2 + 1);
                if (score2 + 1 === 10) {
                    setWinner(user2);
                }
                setCor([770, 300]);
            } else if (cor[0] + dx < ballRadius) {
                setBlocker1Y(300);
                setBlocker2Y(300);
                setDx(-dx);
                setScore1(score1 + 1);
                if (score1 + 1 === 10) {
                    setWinner(user1);
                }
                setCor([30, 300]);
            }
        }

        const interval = setInterval(draw, 30);

        return () => clearInterval(interval);
    }, [cor, dx, dy, blocker1Y, blocker2Y, score1, score2]);

    useEffect(() => {
        function handleBallEvent(data) {
            const { x, y } = data;
            setCor([x, y]);
        }
        function handleScoreEvent(data) {
            const x = data;
            setScore1(x);
            if (x === 10) {
                setWinner(user1);
            }
        }

        if (gameEngine && gameEngine.io) {
            gameEngine.io.on("ball", handleBallEvent);
            gameEngine.io.on("score", handleScoreEvent);
        }

        return () => {
            if (gameEngine && gameEngine.io) {
                gameEngine.io.off("ball", handleBallEvent);
                gameEngine.io.off("score", handleScoreEvent);
            }
        };
    }, [gameEngine]);

    useEffect(() => {
        function handleKeyDown(event) {
            switch (event.key) {
                case 'ArrowUp':
                    if (blocker2Y - 20 >= blockerHeight / 2) {
                        setBlocker2Y(blocker2Y - 20);
                    }
                    break;
                case 'ArrowDown':
                    if (blocker2Y + 20 <= canvasHeight - blockerHeight / 2) {
                        setBlocker2Y(blocker2Y + 20);
                    }
                    break;
                default:
                    break;
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [blocker2Y]);

    return (
        <div className="text-center">
            <div className="text-lg font-semibold inline-block">
                Your Score: <span className="text-blue-600 space-x-10">{score1}</span>   Player 2 Score: <span className="text-green-600">{score2}</span>
            </div>
            <div className="bg-black p-3">
                <canvas ref={canvasRef} className="block" width={canvasWidth} height={canvasHeight}></canvas>
                <img ref={ballImageRef} src={ballImage} alt="Ping Pong Ball" className="hidden" />
            </div>
        </div>
    );
}

export default PingPongGame;
