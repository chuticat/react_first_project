/* eslint-disable  */
import React, { Component } from 'react';
import axios from 'axios';
import './index.css';

// Font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Components imports
import { Button } from '../Button';
import { Table } from '../Table';
import { Search } from '../Search';

// Constants imports
import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants/index.js'

library.add(faSpinner, faSortUp, faSortDown);

const Loading = () => 
  <div>
    <FontAwesomeIcon 
      icon = "spinner"
      pulse = { true }
      size = "2x"
    />
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) => 
  isLoading
  ? <Loading />
  : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const  { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] 
    ? results[searchKey].hits 
    : [];

  const updatedHits = [ 
    ...oldHits,
    ...hits
  ];

  return {
    results: { 
      ...results,
      [searchKey] : { hits: updatedHits, page }
    },
    isLoading: false
  };
}

class App extends Component {
  _isMounted = false;

  constructor(props){
    super(props);

    this.state = {
      results : null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.needsToSeatchTopStories = this.needsToSeatchTopStories.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  needsToSeatchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({ 
      results: { 
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);

    if (this.needsToSeatchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  render() {
    const { 
      searchTerm, 
      results, 
      searchKey,
      error,
      isLoading,
      sortKey,
      isSortReverse,
    } = this.state;

    const page = (
      results && 
      results[searchKey] && 
      results[searchKey].page
    ) || 0;

    const list = (
      results && 
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value = { searchTerm }
            onChange = { this.onSearchChange }
            onSubmit = { this.onSearchSubmit }
          >
            Search
          </Search>
        </div>
        {
          error
          ? <div className="interactions">
            <p>Something went wrong.</p>
          </div>
          :
          <Table 
            list = { list }         
            onDismiss = { this.onDismiss }
          />
        }
        <div className="interactions">
          <ButtonWithLoading
            isLoading={ isLoading }
            onClick={ () => this.fetchSearchTopStories(searchKey, page + 1) }
          >
          More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
}
