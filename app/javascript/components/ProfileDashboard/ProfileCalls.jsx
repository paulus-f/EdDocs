import React from 'react';
import Chip from '@material-ui/core/Chip';
import { withRouter, Link } from 'react-router-dom';

class ProfileCalls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: props.currentUser,
      channels: props.channels,
    };
  }

  render() {
    const { channels } = this.state;

    return (
      <div id='profileCalls'>
        <h1> Your calls </h1>
        <br/>
        {channels.map((channel) =>{
          return (
            <Link target={"_blank"}
                  to={`/video_channels/${channel.id}`} 
                  activeClassName='active'>
              <Chip key={channel.id}
                    label={channel.name}
                    clickable
                    color='primary' />
            </Link>
          );
        })}
      </div>
    );
  }
}

export default withRouter(ProfileCalls);