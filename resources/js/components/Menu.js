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
    return (
      <div className="container menu">
        <Nav>
          <NavItem>
            <NavLink tag={Link} to="/dashboard">My Interests</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/request-category">Request Category</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/contests">Contests</NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(Menu);