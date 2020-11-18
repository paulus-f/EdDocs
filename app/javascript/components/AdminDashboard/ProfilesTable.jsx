import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import axios from 'axios';
import Functions from '../../utils/Functions';
import DialogMessage from './DialogMessage'
import RadioGroup from '@material-ui/core/RadioGroup'
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'email', numeric: true, disablePadding: false, label: 'Email' },
  { id: 'createdAt', numeric: true, disablePadding: false, label: 'Created At' },
  { id: 'role', numeric: true, disablePadding: false, label: 'Role' },
  { id: 'approve', numeric: true, disablePadding: false, label: 'approve' },
];

class EnhancedTableHead extends React.Component {
  constructor(props) {
    super(props);
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align="center"
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});


let EnhancedTableToolbar = props => {
  const { 
    numSelected, 
    classes, 
    handleClickDelete, 
    handleApproveUsers,
    selected,
    haveApproving
   } = props;
   var approveUsers = null
   if(!haveApproving) {
     approveUsers = <Tooltip title="Approve">
                      <IconButton aria-label="Approve" 
                        onClick={event => handleApproveUsers(event, selected)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
   }

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Users
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div>
            {approveUsers}
            <Tooltip title="Delete">
              <IconButton aria-label="Delete"
                onClick={event => handleClickDelete(event, selected)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <React.Fragment>
            {props.renderFilterSet()}
            <Tooltip title="Filter list">
                <IconButton aria-label="Filter list" onClick={props.openCloseFilters}>
                  <FilterListIcon />
                </IconButton>
            </Tooltip>
          </React.Fragment>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '83%',
    //marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});
class ProfilesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'email',
      selected: [],
      page: 0,
      rowsPerPage: 10,
      currentUser: props.currentUser,
      users: props.users,
      open: false,
      typeClickMsg: '',
      message: '',
      haveApproving: false,
      openFilter: false,
    };
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleApproveUsers = this.handleApproveUsers.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.getMessage = this.getMessage.bind(this)
    this.setApproving = this.setApproving.bind(this)
    this.renderFilterSet = this.renderFilterSet.bind(this)
    this.openCloseFilters = this.openCloseFilters.bind(this)
    this.filterUsers = this.filterUsers.bind(this)
    console.log(this.state.users)
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.state.users.forEach( user => {
        if(user.approve){
          this.setState({
            haveApproving: true,
          })
        }
      })
      this.setState(state => ({ selected: state.users.map(user => user.id) }));
      return;
    }
    this.setState({ 
      selected: [],
      haveApproving: false
    });
  };

  handleClick = (event, id) => {
    const { selected, users } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      this.setApproving(true, users, id)
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      this.setApproving(false, users, id)
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      this.setApproving(false, users, id)
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      this.setApproving(false, users, id)
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
   
    this.setState({ 
      selected: newSelected
    });
  };

  setApproving(value, users, id){
    users.forEach( user => {
      if(user.id == id && user.approve){
        this.setState({
          haveApproving: value
        })      
      }
    })
  }

  handleClose = (event, value)  => {
    event.preventDefault();
    this.setState({ open: false })
    const token = Functions.getMetaContent("csrf-token");
    const { message, selected } = this.state;
    switch(value)
    {
      case 'delete':
        console.log("delete")
        axios.post(`http://localhost:3000/delete_users`, {
          users_id: selected,
          message: message,
          authenticity_token: token 
        })
        .then(res => {
          var users = this.state.users, usersId = selected
          console.log(users)
          console.log(usersId)
          usersId.forEach((userId, userIdIndex, usersId) => {
            for(var i = 0; users.length; ++i)
            {
              if(users[i].id == userId)
              {
                users.splice(i,1)
                break
              }
            }
          })
          this.setState({
            users: users
          })
        })
        break;
      case 'approve':
        console.log("approve")
        axios.post('/approve_users', {
          users_id: selected,
          message: message,
          authenticity_token: token 
        })
        .then(res => {
          var users = this.state.users, usersId = selected
          console.log(users)
          console.log(usersId)
          users.forEach((user, userIndex, users) => {
            usersId.forEach((userId, userIdIndex, usersId) => {
              if(user.id == userId)
              {
                users[userIndex].approve = true;
              }
            })
          })
          this.setState({
            users: users,
            selected: []
          })
        })
        break;
    }
  }

  filterUsers = (value) => {
    axios.get('/user_table/filter/', { 
      params: {
        filter_category: value,
      }
    })
    .then( res => {
      console.log(res)
      this.setState({
        users: JSON.parse(res.data.users)
      })
    })
  }

  openCloseFilters() {
    this.setState({openFilter: !this.state.openFilter})
  }

  handleChange = event => {
    const name = event.target.name
    this.setState({ [name]: event.target.value });
    if (name == 'selectOnly')
      this.filterUsers(event.target.value)
  };


  renderFilterSet() {
    if (this.state.openFilter)
      return (   
      <Paper style={{width: 700}}>
        <FormControl component="fieldset">
          <FormLabel component="h4">Select</FormLabel>
            <RadioGroup
              aria-label="select only"
              name="selectOnly"
              value={this.state.selectOnly}
              onChange={this.handleChange}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio color="primary" />}
                label="All"
                labelPlacement="end"
              />
              <FormControlLabel
                value="managers"
                control={<Radio color="primary" />}
                label="Managers"
                labelPlacement="end"
              />
              <FormControlLabel
                value="students"
                control={<Radio color="primary" />}
                label="Students"
                labelPlacement="end"
              />
              <FormControlLabel
                value="parents"
                control={<Radio color="primary" />}
                label="Parents"
                labelPlacement="end"
              />
              <FormControlLabel
                value="approve"
                control={<Radio color="primary" />}
                label="Approve"
                labelPlacement="end"
              />
              <FormControlLabel
                value="not_approve"
                control={<Radio color="primary" />}
                label="Not Approve"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
        </Paper>);
    else
     return '';
  }

  getMessage = (value) => {
    this.setState({
      message: value
    })
    console.log(this.state)
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  
  handleClickDelete = (event, selected) => {
    event.preventDefault();
    this.setState({
      open: true,
      typeClickMsg: 'delete' 
    })
    console.log(this.state)
    
  }

  handleApproveUsers = (event, selected) => {
    event.preventDefault();
    this.setState({
      open: true,
      typeClickMsg: 'approve' 
    })
  }


  render() {
    const { classes } = this.props;
    const { haveApproving, users, order, orderBy, selected, rowsPerPage, page, typeClickMsg, open } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        
        <DialogMessage getMessage={this.getMessage} handleClose={this.handleClose} typeClickMsg={typeClickMsg} open={open}/>

        <EnhancedTableToolbar 
          haveApproving= {haveApproving} 
          handleApproveUsers={this.handleApproveUsers} 
          handleClickDelete = {this.handleClickDelete} 
          numSelected={selected.length} 
          selected={selected}
          openCloseFilters={this.openCloseFilters}
          renderFilterSet={this.renderFilterSet}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(users, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => {
                  const isSelected = this.isSelected(user.id);
                  var approved, date;
                  date = new Date(user.created_at).toLocaleString() 
                  if(user.approve) {
                    approved = 'approved'
                  }
                  else {
                    approved =  'not approved'
                  }

                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, user.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={user.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" align="center" padding="none">
                        {user.email}
                      </TableCell>
                      <TableCell align="center">{date}</TableCell>
                      <TableCell align="center">{user.role}</TableCell>
                      <TableCell align="center"> {approved} </TableCell>
                      <TableCell align="center"> 
                        <IconButton aria-label="Impersonation" >
                          <PersonIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

ProfilesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfilesTable);