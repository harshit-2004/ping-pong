import React, { useEffect, useRef, useState } from 'react';
import ballImage from '../assets/fitnessBall.png'; 

function PingPongGame({ blocker1Y, blocker2Y, setBlocker1Y, setBlocker2Y ,gameEngine, gameName , setWinner , user1 ,user2}) {
    // Constants for game elements
    const ballRadius = 10;
    const blockerWidth = 10;
    const blockerHeight = 100;
    const paddleOffset = 10; // Offset from the canvas edge for the blockers
    const canvasWidth = 800;
    const canvasHeight = 600;

    // Refs for canvas and ball image
    const canvasRef = useRef(null);
    const ballImageRef = useRef(null);

    // State variables for ball position, speed, and scores
    const [cor, setCor] = useState([ballRadius + paddleOffset + blockerWidth, 300]);
    const [dx, setDx] = useState(10);
    const [dy, setDy] = useState(10);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);

    // useEffect to draw canvas and game elements, handle game logic
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Function to draw the ball
        function drawBall() {
            ctx.drawImage(ballImageRef.current, cor[0] - ballRadius + paddleOffset, cor[1] - ballRadius, ballRadius * 2, ballRadius * 2);
        }

        // Function to draw game elements and handle collisions
        function draw() {

            // Clear canvas
            ctx.fillStyle = '#00efff';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // Draw ball
            drawBall();

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

            // setCor([cor[0] + dx, cor[1] + dy]);
            let x = cor[0] + dx;
            let y = cor[1]+dy;
            settingBall(x, y);

            // Check collision with side walls and update scores
            if (cor[0] + dx > canvasWidth - ballRadius) {
                // setScore2(score2 + 1);
                setBlocker1Y(300);
                setBlocker2Y(300);
                setDx(-dx);
                // setScore2(score2+1);
                settingScore(score2+1);
                settingBall(770, 300);
            } else if (cor[0] + dx < ballRadius) {
                setBlocker1Y(300);
                setBlocker2Y(300);
                // setScore1(score1+1);
                // settingScore(score1+1,score2);
                settingBall(30, 300);
                setDx(-dx);
            }
        }

        // Call draw function in intervals
        const interval = setInterval(draw, 30);

        // Clean up interval
        return () => clearInterval(interval);

      function settingScore(x){
        if(x==10){
          setWinner(user2);
        }
        console.log("emmiting scores");
        gameEngine.io.emit("score",{gameName,x});
        setScore2(x);
      }

      function settingBall(x, y) {
        gameEngine.io.emit("ball", { gameName, x, y});
      }
    }, [cor, dx, dy, blocker1Y, blocker2Y, score1, score2]);

    useEffect(() => {
      function handleBallEvent(data) {
        const { x, y } = data;
        // console.log("ball ",x,y);
        setCor([x, y]);
      }
      function handleScoreEvent(data) {
        const x = data;
        setScore1(x);
        console.log("scores ",x);
        if(x==10){
            setWinner(user1);
          }
      }

      // Listen for "ball" event from the server
      if (gameEngine && gameEngine.io) {
          gameEngine.io.on("ball", handleBallEvent);
      }
      if (gameEngine && gameEngine.io) {
          gameEngine.io.on("score", handleScoreEvent);
      }

      return () => {
        if (gameEngine && gameEngine.io) {
            gameEngine.io.off("ball", handleBallEvent);
        }
        if (gameEngine && gameEngine.io) {
            gameEngine.io.off("score", handleScoreEvent);
        }
    };

  }, [gameEngine]);


    // useEffect to handle keyboard input for controlling blocker2
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

        // Add event listener for keydown
        window.addEventListener('keydown', handleKeyDown);

        // Clean up event listener
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [blocker1Y, blocker2Y]);

    // Render the game
    return (
        <div class="text-center">
        <div class="text-lg font-semibold inline-block">
            Your Score : <span class="text-blue-600 space-x-10">{score1}</span>   Player 2 Score : <span class="text-green-600">{score2}</span>
        </div>
        <div class="bg-black p-3">
            <canvas ref={canvasRef} class="block" width={canvasWidth} height={canvasHeight}></canvas>
            <img ref={ballImageRef} src={ballImage} alt="Ping Pong Ball" class="hidden" />
        </div>
    </div>

    );
}

export default PingPongGame;
