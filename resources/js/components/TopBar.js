import React, {
  Component
} from 'react';
import {
  NavLink as Link
} from 'react-router-dom';
import {
  Nav, NavItem, NavLink, NavbarBrand
} from 'reactstrap';

import RightBar from './RightBar';
import Bitmaps from '../theme/Bitmaps';

class TopBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {type} = this.props;
    
    return (
      <Nav className="top-header topbar">
        <NavbarBrand className="nav-logo" tag={Link} to={'/' + type}>
          <img src={Bitmaps.logo} alt="Logo" />
        </NavbarBrand>

        {
          type == 'web' && (
            <Nav>
              <NavItem>
                <NavLink tag={Link} to="/web/settings">Settings</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/web/categories">Categories</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/web/contests">Contests</NavLink>
              </NavItem>
            </Nav>
          )
        }

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

        <RightBar type={type} />
      </Nav>
    );
  }
}

export default TopBar;