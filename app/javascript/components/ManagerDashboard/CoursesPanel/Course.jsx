import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import IconDelete from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import Icon from '@material-ui/core/Icon';
import IconCached from '@material-ui/icons/Cached';
import CardHeader from '@material-ui/core/CardHeader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

const styles = theme => ({
  card: {
    maxWidth: 300,
    maxHeigth: 350
  },
  media: {
    height: 140,
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },

  headerColorGreen: {
    backgroundColor: green[400]
  },
  headerColorRed: {
    backgroundColor: red[400]
  },
  headerColorOrange: {
    backgroundColor: orange[400]
  },

});

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: this.props.course,
      image_url: this.props.course.image_url,
      image: null,
      expanded: false,
    };  

    this.edit = this.edit.bind(this)
  }

  handleChangeImage = event => {
    event.preventDefault();
    var file = event.target.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);
      reader.onloadend = (e) => {
        axios.post(`/foundation/preload`, {
          id: this.state.foundation.id,
          image: [reader.result],
          authenticity_token: Functions.getMetaContent("csrf-token")
        })
        .then(res => {
          console.log(res)
          this.setState({
            image_url: res.data.url
          })  
        })
    }
  }

  edit(){
    this.props.renderCourseFormForUpdate(this.state.course, this.props.level)
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  checkStatus() {
    const { classes } = this.props;
    const now = new Date()
    const start = new Date(this.state.course.start)
    const finish = new Date(this.state.course.finish)
    if (now < finish && now >= start)
      return <CardHeader
              title="In progress"
              className={classes.headerColorOrange + ' HeaderCard'}
              /> 
    else if (now >= finish)
        return <CardHeader
                title="Finished"
                className={classes.headerColorGreen + ' HeaderCard'}
               /> 
    else
      return <CardHeader
              title="Pending"
              className={classes.headerColorRed + ' HeaderCard'}
              /> 
  }

  render() {
    const { classes } = this.props;
    let actions = ''
    if (!this.props.student)
    actions = <div> 
                <IconButton aria-label="Delete" onClick={() => { if (window.confirm('Are you sure?')) this.props.deleteCourse(this.state.course)}}>
                  <IconDelete />
                </IconButton>
                <IconButton onClick={this.edit}>
                  <IconCached color='primary'/>
                </IconButton>
                </div>
    return (
      <Card className={classes.card + " course-card card"} style={this.state.expanded ? {height: 'auto'} : {height: '380px'} }>
          {this.checkStatus()}
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={this.state.image_url}
            title={this.state.course.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this.state.course.name}
            </Typography>
            <Typography>Level: {this.props.level}</Typography>
            <Typography>Hours: {this.state.course.hours}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {actions}
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography component='h5' variant='h6'>Shedule:</Typography>
            <Typography paragraph>
              {new Date(this.state.course.start).toDateString() + ' --- ' + new Date(this.state.course.finish).toDateString()}
            </Typography>
            <Typography component='h5' variant='h6'>Short Description:</Typography>
            <Typography paragraph>
              {this.state.course.description}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

Course.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Course);