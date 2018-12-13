import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const Arrow = ({ isSortReverse }) => {
    const arrowType = isSortReverse
      ? "sort-up"
      : "sort-down";
  
    return (
      <span>
      <FontAwesomeIcon
        icon = { arrowType }
      />
    </span>
    );
  }