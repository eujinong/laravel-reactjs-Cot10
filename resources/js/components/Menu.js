import React, {
  Component
} from 'react';

import {
  withRouter, NavLink as Link
} from 'react-router-dom';

import {
  Nav, NavItem, NavLink
} from 'reactstrap';

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type} = this.props;
    
    return (
      <div className="container menu">
        {
          type == 'contest' && (
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/contest/categories">Categories</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/contest/contests">Contests</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/contest/completed">Completed</NavLink>
              </NavItem>
            </Nav>
          )
        }
      </div>
    );
  }
}

export default withRouter(Menu);