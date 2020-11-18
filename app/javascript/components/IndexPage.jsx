import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import axios from 'axios';
import FormLabel from '@material-ui/core/FormLabel';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Pagination from "material-ui-flat-pagination";
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import CardFoundation from './IndexPage/CardFoundation'
import { Route, BrowserRouter } from 'react-router-dom';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});




class IndexPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      foundations: JSON.parse(props.foundations),
      currentUser: props.current_user,
      pagefoundations: JSON.parse(props.foundations),
      offset: 0,
      total: JSON.parse(props.foundations).length,
      type: 'all',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(offset) {
    this.setState({ offset });
  }

  handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({[name]: e.target.value, offset: 0})
    let pagefoundations
    if (name == 'type') {
      pagefoundations = value == 'all' ? this.state.foundations : this.filterFoundations(this.state.foundations, value)
    }
    else if (this.state.type != 'all'){
      pagefoundations = this.filterFoundations(this.state.pagefoundations, this.state.type)
    }
    else {
      pagefoundations = this.state.foundations
    }
    this.setState({pagefoundations: pagefoundations, total: pagefoundations.length, offset: 0})
  }

  filterFoundations(foundations, value){
    return foundations.filter(foundation => {if (foundation.foundation.type_foundation == value) return true})
  }
  
  render() {
    const { classes } = this.props;
    const { foundations, currentUser, pagefoundations, total, offset} = this.state
    return (
      <BrowserRouter>
        <Route path='/'>
          <div>
            <Paper className='IndexPage'>
              <div className='form-row' style={{maxWidth:'1845px', minHeight:'80px'}}>
                  <div className='col-md-8 IndexPageTitle'>
                    <h2>Our foundations</h2>
                  </div>
                  <div className='col-md-2'>
                  <FormControl className={classes.formControl +' IndexPageSelect'}> 
                  <InputLabel htmlFor="type-select">Type</InputLabel>
                    <Select
                      className='type-select'
                      value={this.state.type}
                      onChange={this.handleChange}
                      color='primary'
                      placeholder='All'
                      inputProps={{
                        name: 'type',
                        id: 'type-select',
                      }}
                    >
                      <MenuItem value="all">
                          All
                        </MenuItem>
                        <MenuItem value="university">
                          University
                        </MenuItem>
                        <MenuItem value="college">
                          College
                        </MenuItem>
                        <MenuItem value="school">
                          School
                        </MenuItem>
                        <MenuItem value="kindergarten">
                          Kindergarten
                        </MenuItem>
                    </Select>
                    </FormControl>
                </div>
                <div className='col-md-2'>
                  <MuiThemeProvider theme={theme} >
                    <CssBaseline />
                    <Pagination
                      limit={10}
                      offset={offset}
                      total={total}
                      className='IndexPagePagination'
                      onClick={(e, offset) => this.handleClick(offset)}
                    />
                  </MuiThemeProvider>
                </div>
              </div>
            </Paper>
            <Grid item xs={12} container className={classes.demo} justify="center" spacing={24}>
              {pagefoundations.slice(offset, offset + 10).map(foundationObj => (
                <Grid key={foundationObj.foundation.id} item>
                  <CardFoundation
                    foundation = {foundationObj}
                    />
                </Grid>
              ))}
            </Grid>
          </div>
        </Route>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(IndexPage);