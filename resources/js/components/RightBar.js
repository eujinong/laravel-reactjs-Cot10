import React, { Component } from 'react';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withRouter, Link
} from 'react-router-dom';
import {
  Navbar, NavItem, NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { logout } from '../actions/common';

class RightBar extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await this.props.logout();

    this.props.history.push('/' + this.props.type);
  }

  render() {
    return (
      <Navbar className="right-nav-bar">
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav>
            <i className="fa fa-user"></i>
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <NavItem>
                <NavLink tag={Link} to="profile">
                  <i className="fa fa-user" /> Profile
                </NavLink>
              </NavItem>
            </DropdownItem>
            <DropdownItem>
                <NavItem>
                  <NavLink tag={Link} to="reset">
                    <i className="fa fa-key" /> Change Password
                  </NavLink>
                </NavItem>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <NavItem>
                <NavLink onClick={this.handleLogout}>
                  <i className="fa fa-unlock-alt" /> Log Out
                </NavLink>
              </NavItem>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        
      </Navbar>
    );
  }
}

const mapStateToProps = () => ({
});
const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RightBar));
