
import Page from './page.jsx';
import { useEffect, useState } from 'react';
import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';
import GameEngine from './socket.js';
import GameOver from './GameOver.js';

function GameStart({onRestart}) {

  const [user2,setUser2] = useState();
  const [user1,setUser1] = useState();
  const [seeForm,setSeeForm] = useState(true);
  const [gameName,setGameName] = useState();
  const [gameEngine,setGameEngine] = useState();
  const [Loading,setLoading] = useState(false);
  const [blocker1Y, setBlocker1Y] = useState(300); // Initial Y position of the first blocker
  const [blocker2Y, setBlocker2Y] = useState(300); // Initial Y position of the second blocker
  const [winner,setWinner] = useState();

  function  handleClick(event){
    event.preventDefault();
    const inputValue = event.target[0].value;

    let gameEngine  = new GameEngine(inputValue);
    gameEngine.io.emit("find",inputValue);
    setGameEngine(gameEngine);

    gameEngine.io.on("finded",(e)=>{
      setLoading(false);
      setGameName(e.gameName);
      if(inputValue==e.p1.name){
        setUser2(e.p2.name);
      }else{
        setUser2(e.p1.name);
      }
      console.log("showing the finded values returned",e);
    })

    gameEngine.io.on("playing",(e)=>{
      setBlocker1Y(e);
    })

    setSeeForm(false);
    setUser1(inputValue);
    setLoading(true);
  }

  useEffect(() => {
    if(gameEngine)
      gameEngine.io.emit("playing",{gameName,blocker2Y});
  },[blocker2Y]);
  useEffect(() => {
    if(gameEngine)
      gameEngine.io.on("leftAnotherPlayer",()=>{
        console.log("Another palyer left the match");
        setWinner(user2);
      });
  },);

  return (
    
    <div className='m-10 flex flex-col items-center'>
      <div className='text-4xl mb-10'>
        Ping Pong Game
      </div>
      {seeForm && (
        <form className='flex flex-col text-center' onSubmit={handleClick}>
          <div className='text-red-400 mb-4'>Enter the User Name </div>
          <input 
            type='text' 
            className='text-green-900 text-center border border-gray-400 rounded-md py-2 px-4 mb-4' 
            name="FirstUser" 
            placeholder='User Name'
            required
          />
          <button 
            className='bg-red-300 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-400' 
            type='submit'
          >
            Search for Another Player
          </button>
        </form>
      )}


      {Loading &&<>
        <div>
          Player Name is {user1}
        </div>
        <div className="flex justify-center items-center mt-6">
          <UseAnimations animation={loading} size={56} />
        </div>
      </>
      }
      {user2&& (
        <>
          <div class="grid grid-cols-2 gap-5">
          <div class="border p-5">
            <p class="text-lg font-semibold mb-2 text-blue-600">Player 1:</p>
            <p class="text-gray-800">{user1}</p>
          </div>
          <div class="border p-5">
            <p class="text-lg font-semibold mb-2 text-green-600">Player 2:</p>
            <p class="text-gray-800">{user2}</p>
          </div>
        </div>

          {winner?(<GameOver winner={winner} onRestart={onRestart}/>):(<Page blocker1Y={blocker1Y} blocker2Y={blocker2Y} setBlocker1Y={setBlocker1Y} setBlocker2Y={setBlocker2Y} gameEngine={gameEngine} gameName={gameName} setWinner={setWinner} user1={user1} user2={user2} />)}
        </>
      )}

    </div>


  );
}

export default GameStart;