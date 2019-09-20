class MineSweeperGrid {
  static initState({
    revealed = false,
    marked = false,
    markType = 'none',
    hasBomb = false,
    bombCount = 0,
  } = {}) {
    return {
      revealed,
      marked,
      markType,
      hasBomb,
      bombCount,
    };
  }

  static getNextMarkType(markType) {
    return {
      flag: 'question',
      question: 'none',
      none: 'flag',
    }[markType];
  }

  static getNextMarked(markType) {
    return this.getNextMarkType(markType) !== 'none';
  }

  static reveal(gridState) {
    return { ...gridState, revealed: true, flag: 'none', marked: false };
  }

  static mark(gridState) {
    return {
      ...gridState,
      marked: this.getNextMarked(gridState.markType),
      markType: this.getNextMarkType(gridState.markType),
    };
  }

  static hasBomb(gridState) {
    return gridState.hasBomb;
  }

  static canReveal(gridState) {
    return !gridState.revealed;
  }

  static canAutoReveal(gridState) {
    return (
      !gridState.revealed && !gridState.marked && gridState.bombCount === 0
    );
  }
}

export default MineSweeperGrid;
