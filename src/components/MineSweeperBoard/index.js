import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import MineSweeperGrid from '../MineSweeperGrid';

const MineSweeperBoardWrapper = styled.div.attrs(({ board }) => ({
  gridColumn: board[0].length,
  gridRow: board[0].length,
}))`
  display: grid;
  grid-column: ${({ board }) => board[0].length};
  grid-row: ${({ board }) => board.length};
`;

const MineSweeperGridWrapper = styled.div.attrs(
  ({ rowIndex, columnIndex }) => ({
    style: {
      gridRow: `${rowIndex + 1} / span 1`,
      gridColumn: `${columnIndex + 1} / span 1`,
    },
  }),
)``;

const MineSweeperBoard = ({ board, onClick, onRightClick, ...props }) => {
  return (
    <MineSweeperBoardWrapper board={board} {...props}>
      {board.map((columns, rowIndex) =>
        columns.map((grid, columnIndex) => {
          return (
            <MineSweeperGridWrapper
              key={`mine-sweeper-grid-${rowIndex}-${columnIndex}`}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
            >
              <MineSweeperGrid
                onClick={() =>
                  onClick({
                    ...grid,
                    rowIndex,
                    columnIndex,
                  })
                }
                onRightClick={() =>
                  onRightClick({
                    ...grid,
                    rowIndex,
                    columnIndex,
                  })
                }
                {...grid}
              />
            </MineSweeperGridWrapper>
          );
        }),
      )}
    </MineSweeperBoardWrapper>
  );
};

MineSweeperBoard.propTypes = {
  onClick: PropTypes.func.isRequired,
  onRightClick: PropTypes.func,
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        revealed: PropTypes.bool.isRequired,
        marked: PropTypes.bool.isRequired,
        markType: PropTypes.oneOf(['flag', 'question', 'none']),
        hasBomb: PropTypes.bool.isRequired,
        bombCount: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
};

export default MineSweeperBoard;
