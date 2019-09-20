import MineSweeperGrid from './MineSweeperGrid';

class MineSweeperBoard {
  static initBoardState({ rowCount = 0, columnCount = 0, bombCount = 0 } = {}) {
    const bombsState = this.initBombsState(rowCount, columnCount, bombCount);

    return this.generateState(
      rowCount,
      columnCount,
      (rowIndex, columnIndex) => {
        const { hasBomb, bombCount } = bombsState[rowIndex][columnIndex];
        return MineSweeperGrid.initState({
          revealed: false,
          marked: false,
          markType: 'none',
          hasBomb,
          bombCount,
        });
      },
    );
  }

  static updateGridStateAt = (
    state,
    atRow,
    atColumn,
    mapper = gridState => gridState,
    identifier = (rowIndex, columnIndex) =>
      rowIndex === atRow && columnIndex === atColumn,
  ) =>
    state.map((columns, rowIndex) =>
      columns.map((gridState, columnIndex) => {
        if (identifier(rowIndex, columnIndex)) {
          return mapper(gridState, rowIndex, columnIndex);
        }
        return gridState;
      }),
    );

  static getAutoRevealPositions(boardState, atRow, atColumn) {
    const gridState = this.getGridStateAt(boardState, atRow, atColumn);

    const { rowCount, columnCount } = this.getBoardSizes(boardState);
    let traversedBoardPositions = [];
    let autoRevealPositions = [[atRow, atColumn]];
    let nextAutoRevealPositions = [];

    const traversedAt = (rowAt, columnAt) =>
      traversedBoardPositions.find(
        ([positionRowIndex, positionColumnIndex]) =>
          positionRowIndex === rowAt && positionColumnIndex === columnAt,
      );
    do {
      nextAutoRevealPositions = [];
      for (const [atRow, atColumn] of autoRevealPositions) {
        const traversed = traversedAt(atRow, atColumn);
        if (traversed) continue;

        const gridState = this.getGridStateAt(boardState, atRow, atColumn);
        nextAutoRevealPositions = MineSweeperGrid.canAutoReveal(gridState)
          ? nextAutoRevealPositions.concat(
              this.getSurroundingDirectionsAt(
                atRow,
                atColumn,
                rowCount,
                columnCount,
              ).filter(([rowIndex, columnIndex]) => {
                const gridState = this.getGridStateAt(
                  boardState,
                  rowIndex,
                  columnIndex,
                );
                const traversed = traversedAt(rowIndex, columnIndex);
                return !traversed && !MineSweeperGrid.hasBomb(gridState);
              }),
            )
          : nextAutoRevealPositions;

        traversedBoardPositions.push([atRow, atColumn]);
      }

      autoRevealPositions = nextAutoRevealPositions;
    } while (nextAutoRevealPositions.length);

    return traversedBoardPositions;
  }

  static revealAt(boardState, atRow, atColumn) {
    const autoRevealPositions = this.getAutoRevealPositions(
      boardState,
      atRow,
      atColumn,
    );

    const newBoardState = this.updateGridStateAt(
      boardState,
      atRow,
      atColumn,
      gridState => MineSweeperGrid.reveal(gridState),
      (rowIndex, columnIndex) => {
        return (
          (rowIndex === atRow && columnIndex === atColumn) ||
          !!autoRevealPositions.find(
            ([positionRowIndex, positionColumnIndex]) =>
              positionRowIndex === rowIndex &&
              positionColumnIndex === columnIndex,
          )
        );
      },
    );

    return newBoardState;
  }

  static markAt(boardState, atRow, atColumn) {
    const newBoardState = this.updateGridStateAt(
      boardState,
      atRow,
      atColumn,
      gridState => MineSweeperGrid.mark(gridState),
    );

    return newBoardState;
  }

  static hasUnrevealedGrids(boardState) {
    return boardState.some(columns =>
      columns.some(gridState => MineSweeperGrid.canReveal(gridState)),
    );
  }

  static hasBombAt(boardState, atRow, atColumn) {
    const gridState = this.getGridStateAt(boardState, atRow, atColumn);
    return MineSweeperGrid.hasBomb(gridState);
  }

  static getGridStateAt(boardState, atRow, atColumn) {
    return boardState[atRow][atColumn];
  }

  static canRevealAt(boardState, atRow, atColumn) {
    const gridState = this.getGridStateAt(boardState, atRow, atColumn);
    return MineSweeperGrid.canReveal(gridState);
  }

  static initBombsState(rowCount, columnCount, bombCount) {
    const bombPositionIndices = new Set(
      Array(rowCount * columnCount)
        .fill()
        .map((value, index) => ({ index, value: Math.random() }))
        .sort((a, b) => b.value - a.value)
        .slice(0, bombCount)
        .map(({ index }) => index),
    );

    const hasBombAt = (atRow, atColumn) =>
      bombPositionIndices.has(atRow * columnCount + atColumn);
    const getSurroundingBombCountAt = (atRow, atColumn) =>
      this.getSurroundingDirectionsAt(
        atRow,
        atColumn,
        rowCount,
        columnCount,
      ).reduce((bombCount, [rowIndex, columnIndex]) => {
        return bombCount + (hasBombAt(rowIndex, columnIndex) ? 1 : 0);
      }, 0);

    return this.generateState(
      rowCount,
      columnCount,
      (rowIndex, columnIndex) => {
        return {
          hasBomb: hasBombAt(rowIndex, columnIndex),
          bombCount: getSurroundingBombCountAt(rowIndex, columnIndex),
        };
      },
    );
  }

  static generateState(rowCount, columnCount, mapper) {
    return Array(rowCount)
      .fill()
      .map((columns, rowIndex) =>
        Array(columnCount)
          .fill()
          .map((grid, columnIndex) => mapper(rowIndex, columnIndex)),
      );
  }

  static isInbound(atRow, atColumn, rowCount, columnCount) {
    return (
      atRow >= 0 &&
      atRow < rowCount &&
      (atColumn >= 0 && atColumn < columnCount)
    );
  }

  static getSurroundingDirectionsAt(atRow, atColumn, rowCount, columnCount) {
    return [
      [atRow - 1, atColumn], // top
      [atRow - 1, atColumn + 1], // top right
      [atRow, atColumn + 1], // right
      [atRow + 1, atColumn + 1], // bottom right
      [atRow + 1, atColumn], // bottom
      [atRow + 1, atColumn - 1], // bottom left
      [atRow, atColumn - 1], // left
      [atRow - 1, atColumn - 1], // top left
    ].filter(([rowIndex, columnIndex]) =>
      this.isInbound(rowIndex, columnIndex, rowCount, columnCount),
    );
  }

  static getBoardSizes(boardState) {
    return { rowCount: boardState.length, columnCount: boardState[0].length };
  }
}

export default MineSweeperBoard;
