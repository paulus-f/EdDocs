import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
//import { createConsumer } from "@rails/actioncable";

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoChannel: props.videoChannel,
      channels: [],
    }
  }

  componentWillMount() {
    //this.createSocket();
  }

  createSocket() {
    App.connectionChannel = App.cable.subscriptions.create({
      channel: 'ConnectionChannel',
      id: this.state.current_user.id
    }, {
      connected: () => {},
      received: (data) => {
        console.log(data)
      },
    });
  }

  render() {
    const { videoChannel, channels } = this.state;

    return (
      <div style={{ paddingTop: 100 }}>
        <Grid container spacing={3}>
          <Grid container item xs={4} spacing={3} />
          <Grid container item xs={4} spacing={3} />
          <Grid container item xs={4} spacing={3} />

          <Grid container item xs={4} spacing={3}>
            
          </Grid>
          <Grid container item xs={4} spacing={3}>
            <Grid container item xs={6} spacing={3}>
              <Button variant='contained' color='primary'>
                Open
              </Button>
            </Grid>

            <Grid container item xs={6} spacing={3}>
              <Button variant='contained' color='primary'>
                Close
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={4} spacing={3}>

          </Grid>

          <Grid container item xs={3} spacing={3} />
          <Grid container item xs={3} spacing={3} >
            <video id='local-video' autoplay></video>
            <audio id='local-audio'></audio>
          </Grid>
          <Grid container item xs={3} spacing={3} />
            <div id='remote-video'></div>
          </Grid>
          <Grid container item xs={3} spacing={3} />


          {channels.map((channel) => {
            return <Grid item xs={3} spacing={3}> 
              test
            </Grid> 
          })}
      </div>
    );
  }
}

export default Channel;
