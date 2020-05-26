import React, {
  Component
} from 'react';

class Full extends Component {
  render() {
    const {
      header, body
    } = this.props;
    return (
      <div className="site-dashboard-content">
        <div className="intro-header">
          {header}
        </div>
        <div className="dashboard-content">
          {body}
        </div>
        <div className="intro-footer">
          <span />
        </div>
      </div>
    );
  }
}

export default Full;
