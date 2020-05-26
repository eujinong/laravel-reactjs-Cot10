import React from 'react';
import {
  Modal, ModalBody,
  Button,
  Row, Col, ModalHeader
} from 'reactstrap';

class Prompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true
    };

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
  }


  handleCancel() {
    let {
      handleCancel
    } = this.props;

    handleCancel = handleCancel || (() => {});
    handleCancel();
  }

  handleConfirm() {
    let {
      handleAccept
    } = this.props;
    const { id } = this.props;

    handleAccept = handleAccept || (() => {});
    handleAccept(id);
  }

  render() {
    const {
      message, title, id
    } = this.props;
    const {
      isOpen
    } = this.state;

    const title_text = title || 'Are you sure?';

    return (
      <Modal
        isOpen={isOpen}
        toggle={this.handleCancel}
        onClosed={this.handleCancel}
        className="modal-prompt"
        id={id}
      >
        <ModalHeader toggle={this.handleCancel} style={{ borderBottom: 'none' }} />
        <ModalBody>
          <Row>
            <Col md={12}><h4>{title_text}</h4></Col>
          </Row>
          {message && (
            <Row>
              <Col md={12}><p>{message}</p></Col>
            </Row>
          )}
          <Row className="mt-5">
            <Col md={12} className="text-right">
              <Button
                type="button"
                color="success"
                onClick={this.handleConfirm}
              >
                Yes
              </Button>
              &nbsp;
              <Button
                type="button"
                color="gray"
                onClick={this.handleCancel}
              >
                No
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    );
  }
}

export default Prompt;
