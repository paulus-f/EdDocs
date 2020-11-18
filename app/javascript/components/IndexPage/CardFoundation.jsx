import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Link, Redirect } from 'react-router-dom';

const styles = {
  card: {
    marginTop: 30,
    width: 300,
    height: 450
  },
  media: {
    height: 285,
  }, 
};

class CardFoundation extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      foundation : this.props.foundation.foundation,
      foundation_url: this.props.foundation.foundation_url,
      students_count: this.props.foundation.students_count
    }
  }

  render() {
    const {classes} = this.props;
    const {foundation, foundation_url, students_count} = this.state;
    const name = foundation.name[0].toUpperCase() + foundation.name.slice(1);
    const type = foundation.type_foundation[0].toUpperCase() + foundation.type_foundation.slice(1);

    return (
      <Card onClick={() => location.reload()} className={classes.card}>
        <CardActionArea  component="div" disableRipple>
          <Link to={'/foundations/'+ this.state.foundation.id}>          
            <CardMedia
              className={classes.media}
              image={foundation_url}
              title={foundation.type_foundation}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {type + ' "' + name + '"'}
              </Typography>
              <Typography  variant='h6' component="h4">
                Students: {students_count}
              </Typography>
              <Typography component="p">
                { foundation.desccription ? foundation.description.slice(0, 100) + '...' : '' }
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    );
  }
}

CardFoundation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CardFoundation);
