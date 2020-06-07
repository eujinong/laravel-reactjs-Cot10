import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';

import {
  Container, Row, Col
} from 'reactstrap';
import { Accordion } from 'semantic-ui-react';

import Bitmaps from '../../theme/Bitmaps';

import TopBar from '../../components/TopBar';
import Menu from '../../components/Menu';

import Api from '../../apis/app';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      parts: [],
      activeIndex: ''
    }
  }

  async componentDidMount() {
    const params = this.props.location.state;

    if (params === undefined) {
      this.props.history.push('/contest/contests');
    } else {
      const data = await Api.post('contest-participants', params);
      const { response, body } = data;
      switch (response.status) {
        case 200:
          this.setState({
            parts: body
          });
          break;
        default:
          break;
      }
    }
  }

  handleClick(e, titleProps) {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { 
      parts,
      activeIndex
    } = this.state;

    let votes = [];
    let media = [];

    let j = 0;
    
    for (let i in parts) {
      let vote = parts[i].round_votes;

      if (votes.indexOf(vote) == -1) {
        votes.push(vote);
      }

      media[j] = [];

      for (let key in parts[i]) {
        if (key.substring(0, 5) == 'media' && parts[i][key] != '') {
          media[j].push(parts[i][key]);
        }
      }

      j++;
    }

    votes.sort(function(a, b) {
      return b - a;
    });

    return (
      <Fragment>
        <TopBar type="contest" />

        <Menu type="contest" />
        
        <div className="dashboard">
          <Container>
            <Row>
              <Col sm="12" className="mt-3">
                <Accordion fluid styled>
                  {
                    parts.map((member, id) => (
                      <Fragment key={id}>
                        <Row>
                          <Accordion.Title
                            className="col-sm-12"
                            active={activeIndex === id}
                            index={id}
                            onClick={this.handleClick.bind(this)}
                          >
                            <span className="mr-5">
                              {
                                activeIndex === id ? (
                                  <i className="fa fa-minus"></i>
                                ) : (
                                  <i className="fa fa-plus"></i>
                                )
                              }
                            </span>
                            <img
                              src={
                                member.profile_image 
                                  ? '../' + member.profile_image 
                                  : (member.gender == 1 ? Bitmaps.maleAvatar : Bitmaps.femaleAvatar)
                                } 
                              className="table-avatar mr-4"
                            />
                            <span>{member.firstname} {member.lastname}</span>
                            <span> , {member.gender == 1 ? 'Male' : 'Female'}, </span>
                            <span>
                              <span className="mr-2">Votes:</span>
                              <span className="mr-2">
                                {member.round_votes}
                              </span>
                              {
                                votes.length > 1 && (
                                  <span className="text-warning">
                                    <i className="fa fa-medal mr-1"></i>
                                    # {votes.indexOf(member.round_votes) + 1}
                                  </span>
                                )
                              }
                            </span>
                            <span>Title: {member.title}</span>
                          </Accordion.Title>
                          
                          <Accordion.Content active={activeIndex === id}>
                            <div className="ml-5">
                              {
                                media[id].map((obj, i) => (
                                  obj.substring(0, 5) == 'files' ? (
                                    <a
                                      className="mb-2"
                                      key={i}
                                      href={'../' + obj}
                                      target="_blank"
                                    >
                                      <i className="fa fa-file mr-1 pt-1"></i> {obj.split("/")[1]}
                                    </a>
                                  ) : (
                                    <a
                                      className="mb-2"
                                      key={i} 
                                      href={obj.substring(0, 4) == 'http' ? obj : 'http://' + obj}
                                      target="_blank"
                                    >
                                      {obj}
                                    </a>
                                  )
                                ))
                              }
                            </div>
                          </Accordion.Content>
                        </Row>
                      </Fragment>
                    ))
                  }
                </Accordion>
              </Col>
            </Row>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Review);