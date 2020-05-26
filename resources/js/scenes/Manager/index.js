/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import TopBar from '../../components/TopBar';
import Menu from '../../components/Menu';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <TopBar type="contest" />

        <Menu type="contest" />
        
        <div className="dashboard">
          
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Dashboard);