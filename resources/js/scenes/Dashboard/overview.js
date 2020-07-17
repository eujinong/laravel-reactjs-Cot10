/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import {
  Container, Row, Col,
  Button
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Overview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      member_id: '',
      parts: []
    }
  }

  async componentDidMount() {
    const user = JSON.parse(localStorage.getItem('auth'));
    const contest_id = this.props.location.state;

    this.setState({
      member_id: user.user.member_info.id
    });

    if (contest_id === undefined) {
      this.props.history.push('/web/contests');
    } else {
      const data = await Api.get('participants');
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            parts: body.parts.filter(item => item.contest_id == contest_id)
          });
          break;
        default:
          break;
      }
    }
  }

  handleFullview(id) {
    this.props.history.push('/contests/fullview', id);
  }

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { member_id, parts } = this.state;

    return (
      <Fragment>
        <div className="top-header tile-top-bar">
          <a href="/">
            <img src={Bitmaps.logo} alt="Cot10" />
          </a>
          <a
            className="mt-3 mr-5"
            style={{float:"right",cursor:"pointer"}}
            onClick={this.handleSignout.bind(this)}
          >
            <i className="fa fa-logout"></i> Sign Out
          </a>
          <a
            className="mt-3 mr-5"
            style={{float:"right",cursor:"pointer"}}
            onClick={this.handleAccount.bind(this)}
          >
            <i className="fa fa-user"></i> Account
          </a>
        </div>

        <Menu />
        
        <div className="dashboard">
          <Container>
          {
            parts.length > 0 && (
              <div className="participant">
                {
                  parts.filter(item => item.member_id != member_id).map((item, index) => (
                    <div key={index}>
                      <Row>
                        <Col sm="3" className="my-3 text-center">
                          <img src={'../' + item.photo_url} />
                        </Col>
                        <Col sm="9" className="my-3">
                          <h3>{item.title}</h3>
                          <p>{item.short_desc}</p>
                          <Button
                            color="primary"
                            type="button"
                            onClick={this.handleFullview.bind(this, item.id)}
                          >
                            View Full Contest Entry
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ))
                }
              </div>
            )
          }
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Overview);