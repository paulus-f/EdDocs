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
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import axios from 'axios';
import Functions from '../../utils/Functions';
import DialogMessage from '../AdminDashboard/DialogMessage'

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
  { id: 'parent_email', numeric: true, disablePadding: false, label: 'Parent' },
  { id: 'student_email', numeric: true, disablePadding: false, label: 'Student' },
  { id: 'level', numeric: true, disablePadding: false, label: 'Level' },
  { id: 'group', numeric: true, disablePadding: false, label: 'Group' },
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
    handleApproveRequests,
    selected,
   } = props;
   var approveRequest = <Tooltip title="Approve">
                      <IconButton aria-label="Approve" 
                        onClick={event => handleApproveRequests(event, selected)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
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
            Requests
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div>
            {approveRequest}
            <Tooltip title="Delete">
              <IconButton aria-label="Delete"
                onClick={event => handleClickDelete(event, selected)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : ('')}
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
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});
class TableOfRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'parent_email',
      selected: [],
      page: 0,
      rowsPerPage: 10,
      currentUser: props.currentUser,
      requests: props.requests,
      open: false,
      typeClickMsg: '',
      message: '',
    };
    this.handleClickOpen = this.handleClickOpen.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.getMessage = this.getMessage.bind(this)
    this.handleApproveRequests = this.handleApproveRequests.bind(this)
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
      this.state.requests.forEach( user => {
        if(user.approve){
          this.setState({
            haveApproving: true,
          })
        }
      })
      this.setState(state => ({ selected: state.requests.map(request => request.id) }));
      return;
    }
    this.setState({ 
      selected: [],
      haveApproving: false
    });
  };

  handleApproveRequests = (event, selected) => {
    event.preventDefault();
    this.setState({
      open: true,
      typeClickMsg: 'approve' 
    })
  }

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleClose = (event, value)  => {
    event.preventDefault();
    this.setState({ open: false })
    const token = Functions.getMetaContent("csrf-token");
    const { message, selected } = this.state;
    switch(value)
    {
      case 'delete':
        console.log("delete")
        axios.post(`/manager_dashboard/delete_requests`, {
          requests_id: selected,
          message: message,
          authenticity_token: token 
        })
        .then(res => {
          var requests = this.state.requests, requestsId = selected
          console.log(requests)
          console.log(requestsId)
          requestsId.forEach((requestId) => {
            for(var i = 0; requests.length; ++i)
            {
              if(requests[i].id == requestId)
              {
                requests.splice(i,1)
                break
              }
            }
          })
          this.setState({
            requests: requests,
            selected: []
          })
          this.props.SetTypeAlert('success')
          this.props.SetMessageAlert('Application denied. Requests deleted successfully!')
          this.props.OpenCloseAlert()
        })
        break;
      case 'approve':
        console.log("approve")
        axios.post(`manager_dashboard/approve_requests`, {
          requests_id: selected,
          message: message,
          authenticity_token: token 
        })
        .then(res => {
          var requests = this.state.requests, requestsId = selected
          console.log(requests)
          console.log(requestsId)
          requestsId.forEach((requestId) => {
            for(var i = 0; requests.length; ++i)
            {
              if(requests[i].id == requestId)
              {
                requests.splice(i,1)
                break
              }
            }
          })
          this.setState({
            requests: requests,
            selected: []
          })
          this.props.SetTypeAlert('success')
          this.props.SetMessageAlert('Approve successfully!')
          this.props.OpenCloseAlert()
        })
        break;
    }
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

  render() {
    const { classes } = this.props;
    const { requests, order, orderBy, selected, rowsPerPage, page, typeClickMsg, open } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, requests.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        
        <DialogMessage getMessage={this.getMessage} handleClose={this.handleClose} typeClickMsg={typeClickMsg} open={open}/>

        <EnhancedTableToolbar 
          handleClickDelete = {this.handleClickDelete}
          handleApproveRequests = {this.handleApproveRequests}
          numSelected={selected.length} 
          selected={selected}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={requests.length}
            />
            <TableBody>
              {stableSort(requests, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => {
                  const isSelected = this.isSelected(request.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, request.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={request.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" align="center" padding="none">
                        {request.parent}
                      </TableCell>
                      <TableCell align="center">{request.student}</TableCell>
                      <TableCell align="center">{request.level}</TableCell>
                      <TableCell align="center"> {request.group} </TableCell>
                      <TableCell align="left">
                        <Tooltip title="Enrollment form" >
                          <a href={'/children/show?id=' + request.student_id}>
                            <VisibilityIcon />
                          </a>
                        </Tooltip>
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
          count={requests.length}
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

TableOfRequests.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableOfRequests);