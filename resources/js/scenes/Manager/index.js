/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import TopBar from '../../components/TopBar';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.props.history.push('/contest/categories');
  }

  render() {
    return (
      <Fragment>
        <TopBar type="contest" />
        
        <div className="dashboard">
          
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Dashboard);