import React from "react";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import AddIcon from '@material-ui/icons/Add';
import { Button } from "@material-ui/core";
import axios from 'axios'
import Functions from '../../utils/Functions'
import $ from 'jquery'

class SignatureEnrollment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      model: 'Signature',
      params : { 
        signture: null,
      },
    }
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick = event => {
    console.log(event.target.value)
    const signature = $("canvas")[1].toDataURL();
    axios.post(`/enrollment/save`, { 
      data: {
        model: 'Signature',
        params : { 
          signature
        },
      }, 
      student_id: this.props.student_id,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then(res => {
      this.setState({
        open: true,
        message: res.data.message,
      })
      setTimeout(()=>{
        window.location.reload()
      }, 1000);
    })
  }

  render() {
    return (
      <div>
        <p>
          <span role="img" aria-label="fingers pointing down">
            👇👇👇👇 Leave your signature here 👇👇👇👇
          </span>
        </p>
        <CanvasDraw
          ref="canvas" 
          style={{
            boxShadow:
              "0 13px 27px -5px rgba(50, 50, 93, 0.25),    0 8px 16px -8px rgba(0, 0, 0, 0.3)",
            width: '100%'

          }}
        />
        <Button style={{marginTop: 30}} 
                onClick={this.handleClick} 
                color="primary" 
                aria-label="Add"
        >
            End Form <AddIcon />
        </Button>
      </div>
    );
  }
}

export default SignatureEnrollment;