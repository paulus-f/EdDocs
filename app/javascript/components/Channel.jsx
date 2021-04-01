import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

const ice = { iceServers: [{ urls: "stun:stun1.l.google.com:19302" }] };
const JOIN_ROOM = 'JOIN_ROOM';
const EXCHANGE = 'EXCHANGE';
const REMOVE_USER = 'REMOVE_USER';

class Channel extends React.Component {
  constructor(props) {
    super(props);
    this.localVideo = React.createRef();
    this.remoteVideo = React.createRef();

    this.state = {
      videoChannel: props.videoChannel,
      channels: [],
      pcPeers: {},
      localstream: null,
      currentUser: props.currentUser,
      isCreator: props.isCreator,
      isOpenAlert: true,
    }

    this.initMediaDevices = this.initMediaDevices.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
    this.handleLeaveSession = this.handleLeaveSession.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.createPC = this.createPC.bind(this);
    this.exchange = this.exchange.bind(this);
    this.broadcastData = this.broadcastData.bind(this);
    this.logError = this.logError.bind(this);
    this.addRemoteVideo = this.addRemoteVideo.bind(this);
  }

  componentDidMount() {
    this.initMediaDevices();
  }

  initMediaDevices = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        this.setState({
          localstream: stream
        });
        this.localVideo.current.srcObject = stream;
      })
      .catch(this.logError);
  }
  
  handleJoinSession = async () => {
    let {currentUser} = this.state;

    App.cable.subscriptions.create(
      {
        channel: 'ConnectionChannel',
        video_channel_id: this.state.videoChannel.id
      }, 
      {
        connected: () => {
          this.broadcastData({
            type: JOIN_ROOM,
            from: this.state.currentUser.id,
          });
      },
      received: (data) => {
        console.log("received", data);
        if (data.from === currentUser.id) return;
        switch (data.type) {
        case JOIN_ROOM:
          return this.joinRoom(data);
        case EXCHANGE:
          if (data.to !== currentUser.id) return;
          return this.exchange(data);
        case REMOVE_USER:
          return this.removeUser(data);
        default:
          return;
        }
      },
    });
  };
  
  handleLeaveSession = () => {
    const { pcPeers, currentUser } = this.state;

    for (let user in pcPeers) {
      pcPeers[user].close();
    }
    this.setState({
      pcPeers: {}
    });
  
    this.broadcastData({
      type: REMOVE_USER,
      from: currentUser,
    });
  };
  
  joinRoom = (data) => {
    this.createPC(data.from, true);
  };
  
  removeUser = (data) => {
    let { pcPeers } = this.state;
    console.log("removing user", data.from);
    let video = document.getElementById(`media-${data.from}`);
    video && video.remove();
    // channels.map
    delete pcPeers[data.from];

    this.setState({
      pcPeers: pcPeers
    });
  };
  
  createPC = (userId, isOffer) => {
    let { pcPeers, localstream, currentUser } = this.state;
    let pc = new RTCPeerConnection(ice);
    const elementRef = this.addRemoteVideo(currentUser);

    pcPeers[userId] = pc;
    this.setState({
      pcPeers: pcPeers
    });

    for (const track of localstream.getTracks()) {
      pc.addTrack(track, localstream);
    }
  
    isOffer &&
      pc
        .createOffer()
        .then((offer) => {
          return pc.setLocalDescription(offer);
        })
        .then(() => {
          this.broadcastData({
            type: EXCHANGE,
            from: currentUser.id,
            to: userId,
            sdp: JSON.stringify(pc.localDescription),
          });
        })
        .catch(this.logError);
    
    pc.onicecandidate = (event) => {
      event.candidate &&
        this.broadcastData({
          type: EXCHANGE,
          from: currentUser.id,
          to: userId,
          candidate: JSON.stringify(event.candidate),
        });
    };
  
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        elementRef.current.srcObject = event.streams[0];
      } else {
        elementRef.current.srcObject = new MediaStream(event.track);
      }
    };
  
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState == "disconnected") {
        console.log("Disconnected:", userId);
        this.broadcastData({
          type: REMOVE_USER,
          from: userId,
        });
      }
    };
  
    return pc;
  };
  
  exchange = async (data) => {
    let { currentUser, pcPeers } = this.state
    let pc;
  
    if (!pcPeers[data.from]) {
      pc = await this.createPC(data.from, false);
    } else {
      pc = pcPeers[data.from];
    }
  
    if (data.candidate) {
      //CHECK
      await pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
              .then(() => console.log("Ice candidate added"))
              .catch(this.logError);
    }
  
    if (data.sdp) {
      const sdp = JSON.parse(data.sdp);
      pc.setRemoteDescription(new RTCSessionDescription(sdp))
        .then(() => {
          if (sdp.type === "offer") {
            pc.createAnswer()
              .then((answer) => {
                return pc.setLocalDescription(answer);
              })
              .then(() => {
                this.broadcastData({
                  type: EXCHANGE,
                  from: currentUser.id,
                  to: data.from,
                  sdp: JSON.stringify(pc.localDescription),
                });
              });
          }
        })
        .catch(this.logError);
    }
  };
  
  broadcastData = (data) => {
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    const headers = new Headers({
      "content-type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    });

    fetch(`/video_channels/${this.state.videoChannel.id}/create_connection`, {
      method: "POST",
      body: JSON.stringify({ connection: {...data} }),
      headers,
    });
  };
  
  logError = (error) => console.warn("Whoops! Error:", error);

  addRemoteVideo = (user) => {
    const {channels} = this.state;
    const videoElement = React.createRef();

    channels.push(
      <Grid key={user.id} id={`media-${user.id}`} container item xs={3} spacing={3}>
        <video id={`video-${user.id}`} ref={videoElement} autoPlay></video>
      </Grid>
    );

    this.setState({
      channels: channels
    })

    return videoElement;
  };

  render() {
    const { videoChannel, channels, isCreator} = this.state;

    const openButton = <Button variant='contained' color='primary' onClick={this.handleJoinSession}>
                         Open
                       </Button>
    return (
      <div style={{ paddingTop: 150 }}>
        <Grid container spacing={3}>
          <Grid container item xs={4} spacing={3}>   
            {isCreator && openButton}
          </Grid>
          <Grid container item xs={4} spacing={3}>
            <Collapse in={open}>
              <div
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      this.setState({
                        isOpenAlert: false
                      });
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {isCreator ? 'You should click the Open Button to create a video call' : 'The connect button is a connection to video call'}
              </div>
            </Collapse>
          </Grid>
          <Grid container item xs={4} spacing={3}/>



          <Grid container item xs={4} spacing={3}>
            
          </Grid>
          <Grid container item xs={4} spacing={3}>
            <Grid container item xs={6} spacing={3}>
              <Button variant='contained' color='primary' onClick={this.handleJoinSession}>
                Connect
              </Button>
            </Grid>

            <Grid container item xs={6} spacing={3}>
              <Button variant='contained' color='primary' onClick={this.handleLeaveSession}>
                Close
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={4} spacing={3}>
          </Grid>



          <Grid container item xs={3} spacing={3} />
          <Grid container item xs={3} spacing={3} >
            <video ref={this.localVideo} id='local-video' autoPlay></video>
            <audio id='local-audio'></audio>
          </Grid>
          <Grid container item xs={3} spacing={3} />

          {channels.map((channel) => channel)}
        </Grid>

      </div>
    );
  }
}

export default Channel;
