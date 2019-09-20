import MineSweeperBoard from './MineSweeperBoard';

class MineSweeper {
  static boardConfigs = {
    expert: {
      rowCount: 16,
      columnCount: 30,
      bombCount: 99,
    },
    intermediate: {
      rowCount: 16,
      columnCount: 16,
      bombCount: 40,
    },
    beginner: {
      rowCount: 10,
      columnCount: 10,
      bombCount: 10,
    },
  };
  static results = {
    win: 'win',
    lost: 'lost',
  };

  static initGameState({ level = 'expert', hasEnded = false, result }) {
    return {
      level,
      hasEnded,
      result,
      boardState: MineSweeperBoard.initBoardState(this.boardConfigs[level]),
    };
  }

  static revealAt(gameState, atRow, atColumn) {
    const { boardState } = gameState;
    const canRevealAt = MineSweeperBoard.canRevealAt(
      boardState,
      atRow,
      atColumn,
    );
    const hasBombAt = MineSweeperBoard.canRevealAt(boardState, atRow, atColumn);
    const hasEndedIfReviewAt = this.hasEndedIfReviewAt(
      gameState,
      atRow,
      atColumn,
    );

    if (!canRevealAt || gameState.hasEnded) {
      return gameState;
    }

    return {
      ...gameState,
      hasEnded: hasEndedIfReviewAt,
      result: hasEndedIfReviewAt
        ? hasBombAt
          ? this.results.lost
          : this.results.win
        : undefined,
      boardState: MineSweeperBoard.revealAt(boardState, atRow, atColumn),
    };
  }

  static markAt(gameState, atRow, atColumn) {
    if (gameState.hasEnded) {
      return gameState;
    }

    return {
      ...gameState,
      boardState: MineSweeperBoard.markAt(
        gameState.boardState,
        atRow,
        atColumn,
      ),
    };
  }

  static hasEndedIfReviewAt(gameState, atRow, atColumn) {
    const hasBombAt = MineSweeperBoard.hasBombAt(
      gameState.boardState,
      atRow,
      atColumn,
    );
    const hasUnrevealedGrids = MineSweeperBoard.hasUnrevealedGrids(
      gameState.boardState,
    );

    return hasBombAt || !hasUnrevealedGrids;
  }
}

export default MineSweeper;
