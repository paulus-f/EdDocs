import React from 'react';

class Profile extends React.Component {
  componentDidMount() {
    $( "#chat" ).load( "/conversations" );
  }

  render() {
    return (
      <div id="chat"/>
    );
  }
}

export default Profile
