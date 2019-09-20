import React from 'react';
import styled from 'styled-components';
import MineSweeperBoard from '../components/MineSweeperBoard';
import { Button, Select } from '../components';
import useMineSweeper from '../hooks/useMineSweeper';

const AppWrapper = styled.div`
  text-align: center;
  min-height: 100vh;
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: calc(10px + 2vmin);
  overflow: auto;
`;

const AppHeader = styled.header`
  font-size: calc(16px + 2vmin);
  margin-bottom: 1rem;
`;

const AppToolbar = styled.div`
  > * {
    margin: 0 1rem;
    min-width: 10rem;
  }
`;

const App = () => {
  const [gameState, { revealAt, markAt, restart }] = useMineSweeper();

  return (
    <AppWrapper className="App">
      <AppHeader className="App-header">
        <div>Minesweeper</div>
        <AppToolbar>
          <Select defaultValue={gameState.level} onChange={restart}>
            <Select.Option value="expert">Expert</Select.Option>
            <Select.Option value="intermediate">Intermediate</Select.Option>
            <Select.Option value="beginner">Beginner</Select.Option>
          </Select>
          <Button onClick={() => restart(gameState.level)}>
            {gameState.result || 'Restart'}
          </Button>
        </AppToolbar>
      </AppHeader>
      <MineSweeperBoard
        board={gameState.boardState}
        onClick={({ rowIndex, columnIndex }) => revealAt(rowIndex, columnIndex)}
        onRightClick={({ rowIndex, columnIndex }) =>
          markAt(rowIndex, columnIndex)
        }
      />
    </AppWrapper>
  );
};

export default App;
