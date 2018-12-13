import React, { Component } from 'react';
import './index.css';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { Button } from '../Button';
import { Sort } from '../Sort';
import { Arrow } from '../Arrow';
import { withSortNull } from '../With-sort-null';
 
import {
    largeColumn,
    midColumn,
    smallColumn,
  } from '../../constants/index.js'

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}

const ArrowWithSortNull = withSortNull(Arrow);

export class Table extends Component { 

    constructor(props) {
      super(props);
  
      this.state = {
        sortKey: 'NONE',
        isSortReverse: false,
      };
  
      this.onSort = this.onSort.bind(this);
    }
  
    onSort(sortKey) {
      const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
      this.setState({ sortKey, isSortReverse });
    }
  
    render() {
  
      const {
        sortKey,
        isSortReverse,
      } = this.state;
      
      const {
        list, 
        onDismiss,
      } = this.props;
  
      const sortedList = SORTS[sortKey](list);
      const reverseSortedList = isSortReverse
        ? sortedList.reverse()
        : sortedList;
      
      return (
        <div className = "table">
          <div className = "table-header">
            <span style = { largeColumn }>
              <ArrowWithSortNull
                isSortReverse = { isSortReverse }
                sortKey = { 'TITLE' }
                activeSortKey = {sortKey}
              />
              <Sort
                sortKey = { 'TITLE' }
                onSort = { this.onSort }
                activeSortKey = { sortKey }
              >
                Title
              </Sort>
            </span>
            <span style = { midColumn }>
              <ArrowWithSortNull
                isSortReverse = { isSortReverse }
                sortKey = { 'AUTHOR' }
                activeSortKey = {sortKey}
              />
              <Sort
                sortKey = { 'AUTHOR' }
                onSort = { this.onSort }
                activeSortKey = { sortKey }
              >
                Author
              </Sort>
            </span>
            <span style = { smallColumn }>
              <ArrowWithSortNull
                isSortReverse = { isSortReverse }
                sortKey = { 'COMMENTS' }
                activeSortKey = {sortKey}
              />
              <Sort
                sortKey = { 'COMMENTS' }
                onSort = { this.onSort }
                activeSortKey = { sortKey }
              >
                Comments
              </Sort>
            </span>
            <span style = { smallColumn }>
              <ArrowWithSortNull
                isSortReverse = { isSortReverse }
                sortKey = { 'POINTS' }
                activeSortKey = { sortKey }
              />
              <Sort
                sortKey = { 'POINTS' }
                onSort = { this.onSort }
                activeSortKey = { sortKey }
              >
                Points
              </Sort>
            </span>
            <span style = { smallColumn }>
              Archive
            </span>
          </div>
          
          { reverseSortedList.map(item =>
              <div key = { item.objectID } className = "table-row">
                <span style = { largeColumn }>
                <a href = { item.url }>{ item.title }</a>
                </span>
                <span style = { midColumn }>{ item.author }</span>
                <span style = { smallColumn }>{ item.num_comments }</span>
                <span style = { smallColumn }>{ item.points }</span>
                <span style = { smallColumn }>
                  <Button onClick = { () => onDismiss(item.objectID) }>
                    Dismiss
                  </Button>
                </span>
              </div>
            )}
        </div>
      );
    }
  }
  
  Table.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        objectID: PropTypes.string.isRequired,
        author: PropTypes.string,
        url: PropTypes.string,
        num_comments: PropTypes.number,
        points: PropTypes.number
      })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
  }