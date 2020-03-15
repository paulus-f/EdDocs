import React from 'react';
import axios from 'axios'
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import TagFacesIcon from '@material-ui/icons/TagFaces';
import MenuItem from '@material-ui/core/MenuItem'
import Functions from '../../utils/Functions'
import { red } from '@material-ui/core/colors';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const styles = theme => ({
  root: {
    marginLeft: 200,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class PanelManagers extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id_foundation: this.props.foundation.id,
      arrayManagers: [],
      foundationManagers: [],
      selected_manager: '',
      message: '',
      open: false
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleDeleteManager = this.handleDeleteManager.bind(this)
    this.addManager = this.addManager.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount(){
    const id_foundation = this.state.id_foundation
    axios.get('/free_managers')
    .then( res => {
      this.setState({
        arrayManagers: res.data.emails,
      })
    })
    
    axios.get('/foundation_managers',{
      params: {
        id_foundation: this.state.id_foundation
      }
    })
    .then( res => {
      console.log(res.data)
      this.setState({
        foundationManagers: res.data.managers,
      })
    })
  }

  handleClose = (event) => {
    this.setState({
      open: false
    })
  }


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleDeleteManager = manager => (event) => {
    const id_foundation = this.state.id_foundation
    axios.delete('/admin/delete_manager', { 
      params: {
        id_foundation,
        selected_manager: manager.id,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }
    })
    .then( res => {
      this.setState({
          open: true,
          message: res.data.message,
          foundationManagers: res.data.managers,
      })
    })
  };

  addManager = event => {
    const id_foundation = this.state.id_foundation
    axios.post('/admin/add_manager', { 
      id_foundation,
      selected_manager: this.state.selected_manager,
      authenticity_token: Functions.getMetaContent("csrf-token")
    })
    .then( res => {
      if(res.data.message) {
        this.setState({
          open: true,
          message: res.data.message,
          foundationManagers: res.data.managers,
        })
      }
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div>
        <Paper className={classes.root}>
          {this.state.foundationManagers.map(manager => {
            return (
              <Chip
                key={manager.id}
                label={manager.email}
                onDelete={this.handleDeleteManager(manager)}
                className={classes.chip}
              />
            );
          })}
        </Paper>
        <div>
          <TextField
            select
            label="Select"
            style={{marginLeft: 200, width: 280}}
            className={classes.textField}
            value={this.state.selected_manager}
            onChange={this.handleChange('selected_manager')}
            helperText="Choose manager"
            margin="normal"
            variant="outlined"
          >
            {this.state.arrayManagers.map(manager => (
              <MenuItem key={manager.id} value={manager.email}>
                {manager.email}
              </MenuItem>
            ))}
            </TextField>
            <Button onClick={this.addManager} style={{marginTop: 20}} color="primary">
              Add <AddIcon/>
            </Button>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.open}
          autoHideDuration={5000}
          onClose={this.handleClose}
          message={<span id="message-id">{this.state.message}</span>}
        />
      </div>
    );
  }
}

PanelManagers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PanelManagers);
