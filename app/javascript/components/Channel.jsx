import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


const Channel = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const roomID = props.videoChannel.id;

  useEffect(() => {
      socketRef.current = io.connect("localhost:8081/");
      navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
          userVideo.current.srcObject = stream;
          socketRef.current.emit("join room", roomID);
          socketRef.current.on("all users", users => {
              const peers = [];
              users.forEach(userID => {
                  const peer = createPeer(userID, socketRef.current.id, stream);
                  peersRef.current.push({
                      peerID: userID,
                      peer,
                  })
                  peers.push(peer);
              })
              setPeers(peers);
          })

          socketRef.current.on("user joined", payload => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                  peerID: payload.callerID,
                  peer,
              })

              setPeers(users => [...users, peer]);
          });

          socketRef.current.on("receiving returned signal", payload => {
              const item = peersRef.current.find(p => p.peerID === payload.id);
              item.peer.signal(payload.signal);
          });
      })
  }, []);

  function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
      });

      peer.on("signal", signal => {
          socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
      })

      return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          socketRef.current.emit("returning signal", { signal, callerID })
      })

      peer.signal(incomingSignal);

      return peer;
  }

  return (
      <Container>
          <StyledVideo muted ref={userVideo} autoPlay playsInline />
          {peers.map((peer, index) => {
              return (
                  <Video key={index} peer={peer} />
              );
          })}
      </Container>
  );
};

/////////////////////////////////

// const ice = { iceServers: [{ urls: "stun:stun1.l.google.com:19302" }] };
// const JOIN_ROOM = 'JOIN_ROOM';
// const EXCHANGE = 'EXCHANGE';
// const REMOVE_USER = 'REMOVE_USER';

// class Channel extends React.Component {
//   constructor(props) {
//     super(props);
//     this.localVideo = React.createRef();
//     this.remoteVideo = React.createRef();

//     this.state = {
//       videoChannel: props.videoChannel,
//       channels: [],
//       pcPeers: {},
//       localstream: null,
//       currentUser: props.currentUser,
//       isCreator: props.isCreator,
//       isOpenAlert: true,
//       isConnected: false
//     }

//     this.initMediaDevices = this.initMediaDevices.bind(this);
//     this.handleJoinSession = this.handleJoinSession.bind(this);
//     this.handleLeaveSession = this.handleLeaveSession.bind(this);
//     this.joinRoom = this.joinRoom.bind(this);
//     this.removeUser = this.removeUser.bind(this);
//     this.createPC = this.createPC.bind(this);
//     this.exchange = this.exchange.bind(this);
//     this.broadcastData = this.broadcastData.bind(this);
//     this.logError = this.logError.bind(this);
//     this.addRemoteVideo = this.addRemoteVideo.bind(this);
//   }

//   componentDidMount() {
//     this.initMediaDevices();
//   }

//   initMediaDevices = () => {
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true,
//       })
//       .then((stream) => {
//         this.setState({
//           localstream: stream
//         });
//         this.localVideo.current.srcObject = stream;
//       })
//       .catch(this.logError);
//   }
  
//   handleJoinSession = async () => {
//     let {currentUser, isConnected } = this.state;
//     this.setState({ isConnected: !isConnected });

//     App.cable.subscriptions.create(
//       {
//         channel: 'ConnectionChannel',
//         video_channel_id: this.state.videoChannel.id
//       }, 
//       {
//         connected: () => {
//           this.broadcastData({
//             type: JOIN_ROOM,
//             from: this.state.currentUser.id,
//           });
//         },
//         received: (data) => {
//           console.log('received', data);
//           if (data.from === currentUser.id) return;
//           switch (data.type) {
//           case JOIN_ROOM:
//             return this.joinRoom(data);
//           case EXCHANGE:
//             if (data.to !== currentUser.id) return;
//             return this.exchange(data);
//           case REMOVE_USER:
//             return this.removeUser(data);
//           default:
//             return;
//           }
//         },
//         rejected: (data) => {
//           console.log(data);
//         }
//       }
//     );
//   };
  
//   handleLeaveSession = () => {
//     const {pcPeers, currentUser, isConnected, subscription} = this.state;

//     for (let user in pcPeers) {
//       pcPeers[user].close();
//     }

//     App.cable.disconnect();
//     this.setState({
//       pcPeers: {},
//       isConnected: !isConnected,
//     });
  
//     this.broadcastData({
//       type: REMOVE_USER,
//       from: currentUser.id,
//     });
//   };

//   joinRoom = (data) => {
//     this.createPC(data.from, true);
//   };

//   removeUser = (data) => {
//     let { pcPeers, channels } = this.state;
//     console.log("removing user", data.from);
//     let video = document.getElementById(`media-${data.from}`);
//     video && video.remove();

//     delete pcPeers[data.from];
//     channels = channels.filter((channel) => { return channel.props.id != `media-${data.from}` });

//     this.setState({
//       pcPeers: pcPeers,
//       channels: channels
//     });
//   };

//   createPC = (userId, isOffer) => {
//     let { pcPeers, localstream, currentUser } = this.state;
//     let pc = new RTCPeerConnection(ice);
//     const elementRef = this.addRemoteVideo(userId);

//     for (const track of localstream.getTracks()) {
//       pc.addTrack(track, localstream);
//     }

//     if(isOffer) {
//       pc.createOffer()
//         .then((offer) => pc.setLocalDescription(offer))
//         .then(() => {
//           setTimeout(() => {
//             this.broadcastData({
//               type: EXCHANGE,
//               from: currentUser.id,
//               to: userId,
//               sdp: JSON.stringify(pc.localDescription),
//             });
//           }, 0);
//         })
//         .catch(this.logError);
//     }

//     pc.onicecandidate = (event) => {
//       event.candidate &&
//         this.broadcastData({
//           type: EXCHANGE,
//           from: currentUser.id,
//           to: userId,
//           candidate: JSON.stringify(event.candidate),
//         });
//     };
  
//     pc.ontrack = (event) => {
//       if (event.streams && event.streams[0]) {
//         elementRef.current.srcObject = event.streams[0];
//       } else {
//         elementRef.current.srcObject = new MediaStream(event.track);
//       }
//     };
  
//     pc.oniceconnectionstatechange = () => {
//       if (pc.iceConnectionState == 'disconnected') {
//         console.log("Disconnected:", userId);
//         this.broadcastData({
//           type: REMOVE_USER,
//           from: userId,
//         });
//       }
//     };

//     pcPeers[userId] = pc;
//     this.setState({
//       pcPeers: pcPeers
//     });
//     return pc;
//   };
  
//   exchange = (data) => {
//     let { currentUser, pcPeers } = this.state
//     let pc = !pcPeers[data.from] ? this.createPC(data.from, false) :  pcPeers[data.from];

//     if (data.candidate) {
//       //CHECK
//       pc.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
//         .then(() => console.log("Ice candidate added"))
//         .catch(this.logError);
//     }
  
//     if (data.sdp) {
//       const sdp = JSON.parse(data.sdp);
//       if(sdp && !sdp.candidate) {
//         pc.setRemoteDescription(new RTCSessionDescription(sdp))
//           .then(() => {
//             if (sdp.type === "offer") {
//               pc.createAnswer()
//                 .then((answer) => {
//                   return pc.setLocalDescription(answer);
//                 })
//                 .then(() => {
//                   this.broadcastData({
//                     type: EXCHANGE,
//                     from: currentUser.id,
//                     to: data.from,
//                     sdp: JSON.stringify(pc.localDescription),
//                   });
//                 });
//             }
//         })
//         .catch(this.logError);
//       }
//     }
//   };
  
//   broadcastData = (data) => {
//     const csrfToken = document.querySelector("[name=csrf-token]").content;
//     const headers = new Headers({
//       "content-type": "application/json",
//       "X-CSRF-TOKEN": csrfToken,
//     });

//     fetch(`/video_channels/${this.state.videoChannel.id}/create_connection`, {
//       method: "POST",
//       body: JSON.stringify({ connection: {...data} }),
//       headers,
//     });
//   };
  
//   logError = (error) => console.warn("Whoops! Error:", error);

//   addRemoteVideo = (userId) => {
//     const { channels } = this.state;
//     const videoElement = React.createRef();

//     channels.push(
//       <Grid key={userId} id={`media-${userId}`} container item xs={3} spacing={3}>
//         <video id={`video-${userId}`} ref={videoElement} autoPlay></video>
//         <h2> UserId: {userId} </h2>
//       </Grid>
//     );

//     this.setState({
//       channels: channels
//     })

//     return videoElement;
//   };

//   render() {
//     const { videoChannel, channels, isCreator, isConnected} = this.state;

//     const openButton = <Button variant='contained' color='primary' onClick={this.handleJoinSession}>
//                          Open
//                        </Button>

//     const connectButton = <Button variant='contained' color='primary' onClick={this.handleJoinSession}>
//                             Connect
//                           </Button>

                          

//     const leaveButton = <Button variant='contained' color='primary' onClick={this.handleLeaveSession}>
//                           Close
//                         </Button>
//     return (
//       <div style={{ paddingTop: 150 }}>
//         <Grid container spacing={3}>
//           <Grid container item xs={4} spacing={3}>   
//           </Grid>
//           <Grid container item xs={4} spacing={3}>
//             <Collapse in={open}>
//               <div
//                 action={
//                   <IconButton
//                     aria-label="close"
//                     color="inherit"
//                     size="small"
//                     onClick={() => {
//                       this.setState({
//                         isOpenAlert: false
//                       });
//                     }}
//                   >
//                     <CloseIcon fontSize="inherit" />
//                   </IconButton>
//                 }
//               >
//                 {isCreator ? 'You should click the Open Button to create a video call' : 'The connect button is a connection to video call'}
//               </div>
//             </Collapse>
//           </Grid>
//           <Grid container item xs={4} spacing={3}/>



//           <Grid container item xs={4} spacing={3}>
            
//           </Grid>
//           <Grid container item xs={4} spacing={3}>
//             <Grid container item xs={6} spacing={3}>
//               {isCreator && openButton}

//             </Grid>

//             <Grid container item xs={6} spacing={3}>
//               {!isConnected && connectButton}
//               {isConnected && leaveButton}
//             </Grid>
//           </Grid>
//           <Grid container item xs={4} spacing={3}>
//           </Grid>



//           <Grid container item xs={3} spacing={3} />
//           <Grid container item xs={3} spacing={3} >
//             <video ref={this.localVideo} id='local-video' autoPlay></video>
//             <audio id='local-audio'></audio>
//           </Grid>
//           <Grid container item xs={3} spacing={3} />

//           {channels.map((channel) => channel)}
//         </Grid>

//       </div>
//     );
//   }
// }

export default Channel;
