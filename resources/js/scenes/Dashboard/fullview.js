/* eslint-disable no-case-declarations */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-state */
import React, {
  Component, Fragment
} from 'react';
import {
  Container, Row, Col
} from 'reactstrap';
import {
  withRouter
} from 'react-router-dom';

import Bitmaps from '../../theme/Bitmaps';

import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Fullview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      part: []
    }
  }

  async componentDidMount() {
    const part_id = this.props.location.state;

    if (part_id === undefined) {
      this.props.history.push('/web/contests');
    } else {
      const data = await Api.get(`participant/${part_id}`);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            part: body.part
          });
          break;
        default:
          break;
      }
    }
  }

  handleAccount() {
    this.props.history.push('/account');
  }

  handleSignout() {
    localStorage.removeItem('auth');

    this.props.history.push('/signin');
  }

  render() {
    const { part } = this.state;
    
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
            part && (
              <div className="participant">
                <Row>
                  <Col sm="3" className="my-3 text-center">
                    <img src={'../' + part.photo_url} />
                    <h5>{part.photo_title}</h5>
                    {
                      part.photo_url2 && part.photo_url2 != '' && (
                        <img src={'../' + part.photo_url2} />
                      )
                    }
                    {
                      part.photo_title2 && part.photo_title2 != '' && (
                        <h5>{part.photo_title2}</h5>
                      )
                    }
                    {
                      part.photo_url3 && part.photo_url3 != '' && (
                        <img src={'../' + part.photo_url3} />
                      )
                    }
                    {
                      part.photo_title3 && part.photo_title3 != '' && (
                        <h5>{part.photo_title3}</h5>
                      )
                    }
                  </Col>
                  <Col sm="9" className="my-3">
                    <h3>{part.title}</h3>
                    <h5>Short Description:</h5>
                    <p>{part.short_desc}</p>
                    <h5>Long Description:</h5>
                    <p>{part.long_desc}</p>
                    <h5>Summary:</h5>
                    <p>{part.summary}</p>
                    {
                      part.link && part.link != '' && (
                        <Fragment>
                          <h5>Link:</h5>
                          <p>{part.link}</p>
                        </Fragment>
                      )
                    }
                  </Col>
                </Row>
              </div>
            )
          }
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Fullview);