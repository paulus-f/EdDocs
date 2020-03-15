import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FoundationEditForm from './FoundationEditForm'


const styles = theme => ({
  card: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '50%',
    marginTop: 20
  },
  media: {
    height: 450,
    width: 400,
    marginLeft: 'auto'
  },
  header: {
    borderBottom: 'none',
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    textAlign: 'center',
    flexBasis: '100%',
  },
  root: {
    width: '100%',
  },
});

const textClass = "media-body pb-3 mb-0 lh-125 border-bottom border-gray";

class FoundationShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundation: this.props.foundation, 
      current_user: this.props.current_user,
      foundationImage: this.props.foundationImage,
      levels: this.props.levels,
      expanded: false,
      edit: false,
    };
    this.handleChange = this.handleChange.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.reload = this.reload.bind(this)
  }

  handleChange() {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  openEditForm() {
    this.setState({edit: !this.state.edit})
  }

  reload(res) {
    console.log(res)
    this.setState({foundation: res.foundation,
                   current_user: res.current_user,
                   foundationImage: res.foundationImage,
                   levels: res.levels,
                   studentsCount: res.studentsCount,
                   managersCount: res.managersCount})
  }
  
  render() {
    const { classes } = this.props;
    let image
    const { foundation, foundationImage, current_user, expanded, levels, edit} = this.state
    var managerButton;
    const name = foundation.name[0].toUpperCase() + foundation.name.slice(1)
    const type = foundation.type_foundation[0].toUpperCase() + foundation.type_foundation.slice(1)
    if (current_user && ( this.props.manager || current_user.role == 'admin')) {
      managerButton = <Button style={{padding: '23px'}} onClick={this.openEditForm} variant='outlined' size="small" color="primary">
                            Edit Foundation
                      </Button>
    }
    image = <CardMedia
                className={classes.media + ' col-md-5'}
                image={foundationImage}
                title={foundation.type_foundation}
             />
    if (edit)
    return <div className='col-md-10'>
      <FoundationEditForm   
      foundation={this.state.foundation}
      closeForm={this.openEditForm}
      reload={this.reload}
      OpenCloseAlert={this.props.OpenCloseAlert}
      SetMessageAlert={this.props.SetMessageAlert}
      SetTypeAlert={this.props.SetTypeAlert}
      image_url={this.state.foundationImage != this.props.foundationImageNotFound ? this.state.foundationImage : ''} 
      image_not_found={this.props.foundationImageNotFound}/>
      <Button style={{marginLeft: '30.5%'}} onClick={this.openEditForm} variant='outlined' size='medium' color="primary">
        Cancel
      </Button>
    </div>
    else
    return (
      <Card className={classes.card}>
        <div className='form-row'>
          <div className='col-md-3'>
            {managerButton}
          </div>
          <div className={managerButton ? 'col-md-9' : 'col-md-12'}>
            <Typography variant='h5' component='h1' className={classes.header} style={{textAlign: managerButton ? 'left' : 'center', fontSize:'40px'}}>
              {type +' "'+ name + '"'}
            </Typography>
          </div>
        </div>
        <Divider variant='fullWidth'/>
        <div className='form-row FoundationInfoBlock'>
          <div className='col-md-7'>
            <div className='form-row' style={{marginTop: '50px', marginBottom: '50px'}}>
              <div className='col-md-5' style={{marginLeft:'auto'}}>
                <Typography gutterBottom variant="h6">
                  Students: {this.props.studentsCount}
                </Typography>  
                <Typography gutterBottom variant="h6">
                  Managers: {this.props.managersCount}
                </Typography>
              </div>
              <div  className='col-md-5' style={{marginRight:'auto'}}>
                <Typography gutterBottom variant="h6">
                  Begin year: {foundation.begin_academic_year}
                </Typography>
                <Typography gutterBottom variant="h6">
                  End year: {foundation.end_academic_year}
                </Typography>
              </div>
          </div>
          <Divider variant='fullWidth'/>
          <div style={{width:'80%', marginLeft:'auto',textAlign:'center', marginRight:'auto', marginTop:'50px'}}>
            <Typography style={{textAlign:'center'}} variant="h6">
              Address: 
            </Typography>
            <Typography component="p">
              {foundation.address}
            </Typography>
          </div>
            <div style={{width:'80%', marginLeft:'auto', marginRight:'auto', marginTop:'50px'}}>
              <Typography style={{textAlign:'center'}} variant="h6">
                Description
              </Typography>
              <Typography component="p">
                {foundation.description}
              </Typography>
            </div>
          </div>
          {image}
        </div>
      <ExpansionPanel expanded={expanded} onChange={this.handleChange} name='expanded'>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <div className={classes.column}>
              <Typography className={classes.heading}>Foundation courses</Typography>
            </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}
        >
        <Grid container spacing={16}>   
         {levels.map(level => { return(
            <Grid  key={level.id} item xs={12} md={3}>
                <Typography variant="h6" className={classes.title}>
                  {level.name[0].toUpperCase() + level.name.slice(1)}
                </Typography>
                <div>
                  <List dense={true}>
                    {level.courses.map(course => { return(
                      <ListItem key={course.id}>
                        <ListItemText
                          primary={course.name}
                        />
                    </ListItem>)}
                    )}
                  </List>
                </div>             
            </Grid>
            )})}
          </Grid> 
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
    );
  }
}

FoundationShow.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(FoundationShow)
