import React, { Component, Fragment } from 'react';

import {
  withRouter
} from 'react-router-dom';

import TopBar from '../../components/TopBar';

class Completed extends Component {
  constructor(props) {
    super(props);
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

export default withRouter(Completed);