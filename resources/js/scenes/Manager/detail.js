import React, { Component, Fragment } from 'react';
import {
  withRouter
} from 'react-router-dom';
import {
  Container, Row, Col,
  FormGroup,
  Label, Input, Button
} from 'reactstrap';

import TopBar from '../../components/TopBar';

import ParticipantTable from '../../components/ParticipantTable';
import Bitmaps from '../../theme/Bitmaps';

import Api from '../../apis/app';

class Detail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contest: [],
      members: [],
      archive: 0,
      group: 0
    }
  }

  async componentDidMount() {
    const contest_id = this.props.location.state;
    
    if (contest_id === undefined) {
      this.props.history.push('/contest/contests');
    } else {
      const detail = await Api.get(`contest/${contest_id}`);
      switch (detail.response.status) {
        case 200:
          this.setState({
            contest: detail.body.contest,
            members: detail.body.members
          });
          break;
        default:
          break;
      }
    }
  }

  async handleProcess(id) {
    const detail = await Api.get(`contest/${id}`);
    switch (detail.response.status) {
      case 200:
        this.setState({
          members: detail.body.members
        });
        break;
      default:
        break;
    }
  }

  handleReviewAll(id) {
    this.props.history.push('/contest/allreview', {id, review: 'all'});
  }

  handleReviewActive(id) {
    this.props.history.push('/contest/activereview', {id, review: 'active'});
  }

  render() {
    const {
      contest,
      members,
      archive,
      group
    } = this.state;

    return (
      <Fragment>
        <TopBar type="contest" />
        
        <div className="dashboard">
          <Container>
            <Row>
              <Col className="d-flex contest" sm="12">
                <div className="mx-3 my-1">
                  <img src={Bitmaps.contest} />
                </div>
                <div className="mx-3 my-1">
                  <h4>{contest.name}</h4>
                  <Row>
                    <Col sm="3" className="text-right">Major Category:</Col>
                    <Col sm="3">{contest.major}</Col>
                    <Col sm="3" className="text-right">Current Round:</Col>
                    <Col sm="3">0</Col>
                  </Row>
                  <Row>
                    <Col sm="3" className="text-right">Sub Category:</Col>
                    <Col sm="3">{contest.sub}</Col>
                    <Col sm="3" className="text-right">Review Entries:</Col>
                    <Col sm="3">
                      <a
                        className="process-link mr-2"
                        onClick={this.handleReviewAll.bind(this, contest.id)}
                      >
                        All
                      </a>
                      <a
                        className="process-link"
                        onClick={this.handleReviewActive.bind(this, contest.id)}
                      >
                        Active
                      </a>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="3" className="text-right">Vote Before:</Col>
                    <Col sm="3">{contest.start_date}</Col>
                    <Col sm="3" className="text-right">Message:</Col>
                    <Col sm="3">
                      Still In
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="3" className="text-right"># of entries started/active:</Col>
                    <Col sm="3">
                      {members.length}
                    </Col>
                    <Col sm="3"></Col>
                    <Col sm="3"></Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              {
                members.length > 0 && (
                  <Row className="my-3">
                    <Col sm="4">
                      <Row>
                        <Col sm="8" className="text-right">
                          <Label className="mt-2" for="archive">Archive Entries with less than</Label>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              name="archive"
                              type="text"
                              onChange={value => {
                                this.setState({
                                  archive: value.currentTarget.value
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col sm="4">
                      <Row>
                        <Col sm="8" className="text-right">
                          <Label className="mt-2" for="group">Re-Group table with</Label>
                        </Col>
                        <Col sm="4">
                          <FormGroup>
                            <Input
                              name="group"
                              type="text"
                              onChange={value => {
                                this.setState({
                                  group: value.currentTarget.value
                                });
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col className="text-right" sm="4">
                      <Button color="warning">Declare the Winners</Button>
                    </Col>
                    <Col className="mt-2" sm="12">
                      <ParticipantTable
                        items={members}
                        archive={archive}
                        group={group}
                      />
                    </Col>
                  </Row>
                )
              }
            </Row>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(Detail);