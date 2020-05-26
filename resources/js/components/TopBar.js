import React, {
  Component
} from 'react';
import {
  NavLink as Link
} from 'react-router-dom';
import {
  Nav, NavbarBrand
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

        <RightBar type={type} />
      </Nav>
    );
  }
}

export default TopBar;