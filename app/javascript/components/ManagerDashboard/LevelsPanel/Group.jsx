import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FaceIcon from '@material-ui/icons/Face';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconCached from '@material-ui/icons/Cached';
import IconDelete from '@material-ui/icons/Delete';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Functions from '../../../utils/Functions'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import axios from 'axios';
import CertificatePanel from './CertificatePanel'

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dense: false,
      secondary: false,
      group: this.props.group,
      edit: false,
      newgroupname: this.props.group.name,
      end_academic_year: null
    };

    this.Edit = this.Edit.bind(this);
    this.handleGroupUpdate = this.handleGroupUpdate.bind(this);
    this.renderFormGroup = this.renderFormGroup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.kickStudentFormGroup = this.kickStudentFormGroup.bind(this);
  }

  componentDidMount(){
    axios.get( '/levels/' + this.state.group.level_id + '/groups/' + this.state.group.id + '/foundation/end_academic_year')
    .then( res => {
      this.setState({
        end_academic_year: res.data.end_academic_year
      })
    })
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value })
  }

  kickStudentFormGroup(student) {
    const group = this.state.group
    const index = group.students.indexOf(student)
    axios.post('/groups/kick_from_group/' + student.id, {
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then(res => {
      group.students.splice(index, 1)
      this.setState({group: group})
    })
    
    this.props.AddToStudentsList(student)
  }

  handleGroupUpdate() {
    const group = this.state.group
    axios.put('/levels/' + this.state.group.level_id + '/groups/' + this.state.group.id, {
      name: this.state.newgroupname,
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then(res => {
      if (res.data) {
        group.name = this.state.newgroupname
        this.setState({group: group, edit: false, newgroupname: ''})
      }
      else {
        this.setState({edit: false, newgroupname: ''})
        this.props.SetTypeAlert('warning')
        this.props.SetMessageAlert('Level with this name already exist!')
        this.props.OpenCloseAlert()
      } 
  })
  }

  Edit() {
    this.setState({edit: !this.state.edit,
                  newgroupname: this.state.group.name})
  }
  
  renderFormGroup() {
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
                value={this.state.newgroupname}
                name="newgroupname"
                required
                margin="dense"
                variant="outlined"
                onChange={this.handleChange}/>
              <Button color="primary" aria-label="Save" onClick={this.handleGroupUpdate}>
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

  render() {
    const { classes } = this.props;
    const { dense} = this.state;
    const name = this.state.group.name[0].toUpperCase() + this.state.group.name.slice(1)
    const dateNow = new Date()
    const endAcademicYear = new Date(this.state.end_academic_year)
    var isEndAcademicYear;
    if(dateNow > endAcademicYear) {
      isEndAcademicYear = <CertificatePanel levelId={ this.state.group.level_id } students={this.state.group.students} />  
    } else { 
      isEndAcademicYear = <List dense={dense}>
                              {this.state.group.students.map( student => (
                                  <ListItem key={student.id}>
                                    <ListItemAvatar>
                                      <Avatar>
                                        <FaceIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={student.profile.last_name +" "+ student.profile.first_name}
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton aria-label="Delete" onClick={() => { if (window.confirm('Are you sure?')) this.kickStudentFormGroup(student)}}>
                                        <IconDelete />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                              ))}
                            </List>
    }
    return(
      <div>{this.renderFormGroup()}
        <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>{name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <div className='Tools'>
            <IconButton onClick={this.Edit}>
              <IconCached color='primary'/>  
            </IconButton>       
            <IconButton onClick={() => { if (window.confirm('Are you sure?')) this.props.DeleteGroup(this.state.group)}}>
              <IconDelete/>  
            </IconButton>  
        </div> 
        <Grid item xs={12} md={6}>
          {isEndAcademicYear} 
        </Grid>
      </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
    )
  }
}

Group.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Group);