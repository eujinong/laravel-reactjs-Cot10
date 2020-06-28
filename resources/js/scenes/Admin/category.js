import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import TopBar from '../../components/TopBar';

class Category extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <TopBar type="web" />
        
        <div className="dashboard container">
          
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Category);