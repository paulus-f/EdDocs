import React from 'react';

class Links extends React.Component {

  render() {
    return (
  <ul className="nav flex-column">
    <li className="nav-item">
      <a className="nav-link" href="/users/password/new">Forgot your password?</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/users/confirmation/new">Didn't receive confirmation instructions?</a>
    </li>
  </ul>
    );
  }
}

export default Links
