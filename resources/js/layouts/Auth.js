import React, {
  Component, Fragment
} from 'react';
import {
  Link
} from 'react-router-dom';

class Auth extends Component {
  render() {
    const {
      signup,
      options,
      form
    } = this.props;

    return (
      <div className="site-intro">
        <div className="container">
          <div className="welcome-text my-5">
            <h1 className="text-center">
              {options['welcome']}
            </h1>
          </div>

          {form}
          
          {
            signup && (
              <Fragment>
                <hr />
                <h1 className="text-center mt-5">
                  <Link to="/contest/signup" className="link">
                    Register to Join us.
                  </Link>
                </h1>
              </Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

export default Auth;
