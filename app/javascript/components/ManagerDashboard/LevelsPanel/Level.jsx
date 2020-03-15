import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton';
import IconCached from '@material-ui/icons/Cached';
import IconDelete from '@material-ui/icons/Delete';
import IconCertificate from '@material-ui/icons/CardMembership'
import DialogContent from '@material-ui/core/DialogContent';
import axios from 'axios';
import Group from './Group'
import { Dialog } from '@material-ui/core';
import Certificate from './CertificateEdit'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Level extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: this.props.level,
      newgroup: false,
      newgroupname: '',
      edit: false,
      certificateAction: false,
      newlevelname: this.props.level.name,
    }
    this.certificateEdit = this.certificateEdit.bind(this)
    this.OpenGroupForm = this.OpenGroupForm.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderFormGroup = this.renderFormGroup.bind(this)
    this.Edit = this.Edit.bind(this)
    this.handleLevelUpdate = this.handleLevelUpdate.bind(this)
    this.DeleteGroup = this.DeleteGroup.bind(this)
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })
  }

  certificateEdit = () => {
    this.setState({
      certificateAction: !this.state.certificateAction,
    })
  }

  handleLevelUpdate() {
    const level = this.state.level
    axios.put('/levels/' + this.state.level.id, {
      name: this.state.newlevelname,
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then(res => {
      if (res.data)
      {
        level.name = this.state.newlevelname      
        this.setState({level: level, edit: false, newlevelname: ''})
      }
      else
      {
        this.setState({edit: false, newlevelname: ''})
        this.props.SetTypeAlert('warning')
        this.props.SetMessageAlert('Level with this name already exist!')
        this.props.OpenCloseAlert()
      }
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    axios.post('/levels/' + this.state.level.id + '/groups', {
        name: this.state.newgroupname,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }).then(res => {
      if(res.data)
       this.props.InsertNewGroup(this.state.level, res.data)
    })
  }

  Edit() {
    this.setState({edit: !this.state.edit,
                   newlevelname: this.state.level.name})
  }

  DeleteGroup(group){
    let studentsWithoutGroup
    axios.delete('/levels/' + this.state.level.id + '/groups/'+ group.id, {
      data: 
      {
        authenticity_token: Functions.getMetaContent("csrf-token")
      }
    }).then(res => {
    studentsWithoutGroup = res.data        
    const groups = this.state.level.groups
    const index = groups.indexOf(group)
    groups.splice(index, 1)
    this.setState({groups: groups})
    this.props.ReloadStudentsWithoutGroup(studentsWithoutGroup)
  }) 
 
}

  renderLevelForm() {
    const { classes } = this.props;
    if (this.state.edit) 
      return (
      <Dialog
        open={this.state.edit}
        onClose={this.Edit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className='form-row'>
          <form className={classes.container} autoComplete="off">
            <FormControl className={classes.formControl}> 
              <TextField
                autoFocus
                id="outlined-group-name-input"
                className={classes.textField}
                value={this.state.newlevelname}
                name="newlevelname"
                required
                margin="dense"
                variant="outlined"
                onChange={this.handleChange}/>
              <Button color="primary" aria-label="Save" onClick={this.handleLevelUpdate}>
                Save
              </Button>
              <Button color="primary" aria-label="Cancel" onClick={this.Edit}>
                Cancel
              </Button>
            </FormControl>
          </form>
          </div>
        </DialogContent>
      </Dialog>
      )
  }

  renderEditCerticate() {
  if (this.state.certificateAction) 
      return (
        <Certificate
          certificateAction = {this.state.certificateAction}
          certificateEdit = {this.certificateEdit}
          levelId = {this.state.level.id}
        />
      )
  }

  OpenGroupForm() {
    this.setState({newgroup: !this.state.newgroup})
  }

  renderFormGroup() {
    const { classes } = this.props;
    if (this.state.newgroup) 
      return (
      <div className='form-row NewGroupForm'>
      <form className={classes.container} autoComplete="off" onSubmit={this.handleSubmit}>
        <FormControl className={classes.formControl}> 
          <TextField
            autoFocus
            id="outlined-group-name-input"
            label="Name of group"
            className={classes.textField}
            value={this.state.newgroupname}
            name="newgroupname"
            required
            margin="dense"
            variant="outlined"
            onChange={this.handleChange}/>
          <Button  color="primary" aria-label="Add" type="submit">
            Add
          </Button>
          <Button color="primary" aria-label="cancel" onClick={this.OpenGroupForm}>
            Cancel
          </Button> 
        </FormControl>
      </form>
      </div>  
      ) 
    else
      return(
      <div className='NewGroupForm'>
      <Button size="medium" color="primary" className={classes.margin} onClick={this.OpenGroupForm}>
        Add group
     </Button>
     </div>
      )
  }

  render() {
    const { classes } = this.props;
    const name = this.state.level.name[0].toUpperCase()+this.state.level.name.slice(1)
    return(
    <div>
      {this.renderLevelForm()}
      {this.renderEditCerticate()}
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="title" className={classes.heading}>
            {name}
          </Typography>  
        </ExpansionPanelSummary>
      <ExpansionPanelDetails>
      <div className='Tools'>
            <IconButton onClick={this.Edit}>
              <IconCached color='primary'/>  
              </IconButton>
            <IconButton onClick={this.certificateEdit}>
              <IconCertificate color='primary'/>  
            </IconButton>   
             <IconButton onClick={() => { if (window.confirm('Are you sure?')) this.props.DeleteLevel(this.state.level)}}>
              <IconDelete/>  
            </IconButton>           
      </div>  
      <div className='form-group Groups'>
        {this.state.level.groups.map(group => (
            <Group key={group.id} group={group}  
                   ReloadStudentsWithoutGroup={this.ReloadStudentsWithoutGroup}
                   AddToStudentsList={this.props.AddToStudentsList}
                   OpenCloseAlert={this.props.OpenCloseAlert}
                   SetMessageAlert={this.props.SetMessageAlert}
                   SetTypeAlert={this.props.SetTypeAlert}
                   DeleteGroup={this.DeleteGroup}/>
              
        ))}
      {this.renderFormGroup()}
      </div>
      </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
    )
  }
}

Level.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Level);