import React from 'react';

export const withSortNull = (Component) => ({ sortKey, activeSortKey, ...rest}) =>
    sortKey !== activeSortKey
    ? null
    : <Component { ...rest } />