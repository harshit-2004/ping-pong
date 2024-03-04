import React, { useEffect, useRef, useState } from 'react';
import ballImage from '../assets/fitnessBall.png'; 

function PingPongGame() {
    const ballRadius = 10;
    const blockerWidth = 10;
    const blockerHeight = 100;
    const paddleOffset = 10; // Offset from the canvas edge for the blockers
    const canvasWidth = 800;
    const canvasHeight = 600;

    const canvasRef = useRef(null);
    const ballImageRef = useRef(null);
    const [cor, setCor] = useState([ballRadius+paddleOffset+blockerWidth, 300]);
    const [dx, setDx] = useState(10);
    const [dy, setDy] = useState(10);
    const [blocker1Y, setBlocker1Y] = useState(300); // Initial Y position of the first blocker
    const [blocker2Y, setBlocker2Y] = useState(300); // Initial Y position of the second blocker
    const [score, setScore] = useState(0);
    const [score2, setScore2] = useState(0);


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function drawBall() {
      ctx.drawImage(ballImageRef.current, cor[0] - ballRadius + paddleOffset, cor[1] - ballRadius, ballRadius * 2, ballRadius * 2);
    }

    function draw() {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      drawBall();
      
      ctx.fillStyle = 'blue';
      ctx.fillRect(paddleOffset, blocker1Y - blockerHeight / 2, blockerWidth, blockerHeight);
      
      ctx.fillStyle = 'green';
      ctx.fillRect(canvasWidth - blockerWidth - paddleOffset, blocker2Y - blockerHeight / 2, blockerWidth, blockerHeight);

      if (cor[0] + dx - ballRadius < blockerWidth + paddleOffset && cor[1] >= blocker1Y - blockerHeight / 2 && cor[1] <= blocker1Y + blockerHeight / 2) {
        setDx(-dx);
      } else if (cor[0] + dx + ballRadius >= canvasWidth - paddleOffset - blockerWidth && cor[1] >= blocker2Y - blockerHeight / 2 && cor[1] <= blocker2Y + blockerHeight / 2) {
        setDx(-dx);
      }
      if (cor[1] + dy > canvasHeight - ballRadius || cor[1] + dy < ballRadius) {
        setDy(-dy);
      }
      setCor([cor[0] + dx, cor[1] + dy]);

      // Check collision with side walls and update scores
      if (cor[0] + dx > canvasWidth - ballRadius) {
        setScore2(score2 + 1);
        setBlocker1Y(300);
        setBlocker2Y(300);
        setCor([770, 300]);
        setDx(-dx);
      } else if (cor[0] + dx < ballRadius) {
        setScore(score + 1);
        setBlocker1Y(300);
        setBlocker2Y(300);
        setCor([30, 300]);
        setDx(-dx);
      }

    }
    const interval = setInterval(draw, 30);

    return () => clearInterval(interval);
  }, [cor, dx, dy, blocker1Y, blocker2Y, score, score2]);

  useEffect(() => {
    function handleKeyDown(event) {
        switch (event.key) {
          case 'ArrowUp':
            if (blocker2Y - 20 >= blockerHeight / 2) {
              setBlocker2Y(blocker2Y - 20); // Move blocker2 up by 20 pixels
            }
            break;
          case 'ArrowDown':
            if (blocker2Y + 20 <= canvasHeight - blockerHeight / 2) {
              setBlocker2Y(blocker2Y + 20); // Move blocker2 down by 20 pixels
            }
            break;
          case 'w':
            if (blocker1Y - 20 >= blockerHeight / 2) {
              setBlocker1Y(blocker1Y - 20); // Move blocker1 up by 20 pixels
            }
            break;
          case 's':
            if (blocker1Y + 20 <= canvasHeight - blockerHeight / 2) {
              setBlocker1Y(blocker1Y + 20); // Move blocker1 down by 20 pixels
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
  }, [blocker1Y, blocker2Y]);

  return (
    <div>
      <div>Score1: {score} && Score2 : {score2}</div>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
      <img ref={ballImageRef} src={ballImage} alt="Ping Pong Ball" style={{ display: 'none' }} />
    </div>
  );
}

export default PingPongGame;
