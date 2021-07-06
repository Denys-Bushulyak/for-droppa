import { useMachine } from "@xstate/react";
import React from "react";
import "./App.css";
import { GameContext, GameEvent, tennisMachine } from "./machine/gameMachine";
import { Players } from "./types/Players";
import { getScore } from "./utils/getScore";

function App() {
  const [state, send] = useMachine<GameContext, GameEvent>(tennisMachine);

  function handleClick(winner: Players) {
    return () => {
      send("AWARD_POINTS", { winner });
    };
  }

  function handleResetClick() {
    send("RESET");
  }

  return (
    <div className="App">
      <h1>{state.value}</h1>
      <div>
        <h2>
          Player A: {getScore(state.context[Players.PlayerA])}{" "}
          <button onClick={handleClick(Players.PlayerA)}>
            Player A win point
          </button>
        </h2>
      </div>
      <div>
        <h2>
          Player B: {getScore(state.context[Players.PlayerB])}{" "}
          <button onClick={handleClick(Players.PlayerB)}>
            Player B win point
          </button>
        </h2>
      </div>

      <button onClick={handleResetClick}>Reset Game</button>
    </div>
  );
}

export default App;
