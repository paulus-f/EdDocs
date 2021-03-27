import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const ice = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
const JOIN_ROOM = 'JOIN_ROOM';
const EXCHANGE = 'EXCHANGE';
const REMOVE_USER = 'REMOVE_USER';

document.onreadystatechange = () => {

};

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
      currentUser: props.currentUser
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
        this.localVideo.current.muted = true;
      })
      .catch(this.logError);
  }
  
  handleJoinSession = () => {
    let {currentUser} = this.state;
    this.initMediaDevices();
    App.cable.subscriptions.create('ConnectionChannel', {
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
    for (let user in pcPeers) {
      pcPeers[user].close();
    }
    pcPeers = {};
  
    this.remoteVideo.innerHTML = '';
  
    this.broadcastData({
      type: REMOVE_USER,
      from: currentUser,
    });
  };
  
  joinRoom = (data) => {
    this.createPC(data.from, true);
  };
  
  removeUser = (data) => {
    let { pcPeers, localstream } = this.state;
    console.log("removing user", data.from);
    let video = document.getElementById(`remoteVideoContainer+${data.from}`);
    video && video.remove();
    delete pcPeers[data.from];

    this.setState({
      pcPeers: pcPeers
    });
  };
  
  createPC = (userId, isOffer) => {
    let { pcPeers, localstream, currentUser } = this.state;
    let pc = new RTCPeerConnection(ice);
    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;
    element.autoplay = "autoplay";
    this.remoteVideo.current.appendChild(element);
    
    pcPeers[userId] = pc;
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
        element.srcObject = event.streams[0];
      } else {
        let inboundStream = new MediaStream(event.track);
        element.srcObject = inboundStream;
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
  
    this.setState({
      pcPeers: pcPeers
    });
    return pc;
  };
  
  exchange = (data) => {
    let {currentUser} = this.state
    let pc;
  
    if (!pcPeers[data.from]) {
      pc = createPC(data.from, false);
    } else {
      pc = pcPeers[data.from];
    }
  
    if (data.candidate) {
      pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
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
              <Button variant='contained' color='primary' onClick={this.handleJoinSession}>
                Open
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
            <div ref={this.remoteVideo} id='remote-video'></div>
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
