import { useReducer } from 'react';
import { MineSweeper } from '../classes';

const reducer = (gameState, action) => {
  switch (action.type) {
    case 'revealAt':
      return MineSweeper.revealAt(gameState, action.atRow, action.atColumn);
    case 'markAt':
      return MineSweeper.markAt(gameState, action.atRow, action.atColumn);
    case 'restart':
      return MineSweeper.initGameState({ level: action.level });
    default:
  }
};

const useMineSweeper = level => {
  const initialState = MineSweeper.initGameState({ level });
  const [gameState, dispatch] = useReducer(reducer, initialState);

  const revealAt = (atRow, atColumn) => {
    dispatch({ type: 'revealAt', atRow, atColumn });
  };
  const markAt = (atRow, atColumn) => {
    dispatch({ type: 'markAt', atRow, atColumn });
  };
  const restart = level => {
    dispatch({ type: 'restart', level });
  };
  return [gameState, { revealAt, markAt, restart }];
};

export default useMineSweeper;
