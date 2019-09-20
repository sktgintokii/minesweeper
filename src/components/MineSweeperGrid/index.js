import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const getDimension = size => {
  if (size === 'small') return '1rem';
  else if (size === 'medium') return '2rem';
  else if (size === 'large') return '3rem';
};

const MineSweeperGridWrapper = styled.div`
  cursor: pointer;
  user-select: none;
  display: block;
  width: ${({ dimension }) => dimension};
  height: ${({ dimension }) => dimension};
  background-color: ${({ revealed }) => {
    if (revealed) return 'gray';
    return 'white';
  }};
  color: black;
  border: 1px solid black;

  &:hover {
    background-color: gray;
  }
`;

const MineSweeperGrid = ({
  size,
  revealed,
  marked,
  markType,
  hasBomb,
  bombCount = 0,
  onClick,
  onRightClick,
  ...props
}) => {
  const handleRightClick = useCallback(
    event => {
      event.preventDefault();
      onRightClick(event);
    },
    [onRightClick],
  );
  const dimension = useMemo(() => getDimension(size), [size]);

  return (
    <MineSweeperGridWrapper
      revealed={revealed}
      dimension={dimension}
      onClick={onClick}
      onContextMenu={handleRightClick}
      {...props}
    >
      {revealed && !hasBomb && <>{bombCount > 0 ? bombCount : ''}</>}
      {revealed && hasBomb && <>💣</>}
      {!revealed && !marked && <></>}
      {!revealed && marked && <>{markType === 'flag' ? '🚩' : '❓'}</>}
    </MineSweeperGridWrapper>
  );
};

MineSweeperGrid.propTypes = {
  revealed: PropTypes.bool.isRequired,
  marked: PropTypes.bool.isRequired,
  markType: PropTypes.oneOf(['flag', 'question', 'none']),
  hasBomb: PropTypes.bool.isRequired,
  bombCount: PropTypes.number,
  onClick: PropTypes.func,
  onRightClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

MineSweeperGrid.defaultProps = {
  size: 'medium',
};

export default MineSweeperGrid;
