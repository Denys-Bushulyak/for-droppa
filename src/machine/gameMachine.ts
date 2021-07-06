import { assign, createMachine } from "xstate";
import { Players } from "../types/Players";

const DUES_POINT = 3;
const WINNER_POINT = 4;
const DUES_WINNER_POINT = 5;
const ADV_POINT = 4;

export interface GameContext {
  [Players.PlayerA]: number;
  [Players.PlayerB]: number;
}

export type GameEvent =
  | { type: "RESET" }
  | { type: "AWARD_POINTS"; winner: Players };

export const tennisMachine = createMachine<GameContext, GameEvent>(
  {
    id: "tennis",
    initial: "play",
    context: {
      [Players.PlayerA]: 0,
      [Players.PlayerB]: 0,
    },
    states: {
      play: {
        always: [
          {
            target: "dues",
            cond: "isDuesState",
          },
          {
            target: "game",
            cond: "didPlayerWin",
          },
        ],
        on: {
          RESET: "resetGame",
          AWARD_POINTS: {
            target: "play",
            actions: ["assignPoint"],
          },
        },
      },
      reset: {
        always: {
          target: "dues",
          actions: assign(() => ({
            [Players.PlayerA]: DUES_POINT,
            [Players.PlayerB]: DUES_POINT,
          })),
        },
      },
      dues: {
        always: [
          {
            target: "reset",
            cond: "isEqual",
          },
          {
            target: "game",
            cond: "didPlayerWinInDues",
          },
        ],
        on: {
          RESET: "resetGame",
          AWARD_POINTS: {
            target: "dues",
            actions: ["assignPoint"],
          },
        },
      },
      resetGame: {
        always: {
          target: "play",
          actions: "resetGame",
        },
      },
      game: {
        on: {
          RESET: "resetGame",
        },
      },
    },
  },
  {
    actions: {
      resetGame: assign(() => ({
        [Players.PlayerA]: 0,
        [Players.PlayerB]: 0,
      })),
      assignPoint: assign((context, event) => {
        return {
          ...context,
          [(event as { type: "AWARD_POINTS"; winner: Players }).winner]:
            context[
              (event as { type: "AWARD_POINTS"; winner: Players }).winner
            ] + 1,
        };
      }),
    },
    guards: {
      isEqual: (ctx) => {
        return (
          ctx[Players.PlayerA] === ADV_POINT &&
          ctx[Players.PlayerB] === ADV_POINT
        );
      },
      didPlayerWin: (context) => {
        return (
          context[Players.PlayerA] === WINNER_POINT ||
          context[Players.PlayerB] === WINNER_POINT
        );
      },
      didPlayerWinInDues: (context) => {
        return (
          context[Players.PlayerA] === DUES_WINNER_POINT ||
          context[Players.PlayerB] === DUES_WINNER_POINT
        );
      },
      isDuesState: (context) => {
        const equalPoint =
          context[Players.PlayerA] === context[Players.PlayerB];
        return equalPoint && context[Players.PlayerA] === DUES_POINT;
      },
    },
  }
);
