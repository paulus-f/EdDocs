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
import AddIcon from '@material-ui/icons/AddComment';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import axios from 'axios';
import Functions from '../../utils/Functions';
import Button from '@material-ui/core/Button';
import NewFoundation from './NewFoundation'
import AdminEditFoundation from './AdminEditFoundation'


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
  { id: 'name', numeric: true, disablePadding: false, label: 'Foundation' },
  { id: 'type_foundation', numeric: true, disablePadding: false, label: 'Type' },
  { id: 'email', numeric: true, disablePadding: false, label: 'Manager email' },
  { id: 'amountStudents', numeric: true, disablePadding: false, label: 'Amount Students' },
  { id: 'address', numeric: true, disablePadding: false, label: 'Address' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'actions', label: 'Actions' }
];

class EnhancedTableHead extends React.Component {
  constructor(props) {
    super(props);
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
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
    handleAddFoundation,
    numSelected, 
    classes, 
   } = props;

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
            Foundations
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div>
            SMTHNG
          </div>
        ) : (
          <div>
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Foundation">
              <IconButton 
                onClick={handleAddFoundation} 
                aria-label="Add Foundation"
                >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
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
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});
class FoundationsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: 'foundation',
      page: 0,
      selected: [],
      rowsPerPage: 10,
      foundations: this.props.foundations,
      isNew: false,
    };
    console.log(this.state.foundations)
    this.handleBack = this.handleBack.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDeleteFoundation = this.handleDeleteFoundation.bind(this)
    this.handleCallManagerDashboard = this.handleCallManagerDashboard.bind(this)
    this.handleAddFoundation = this.handleAddFoundation.bind(this)
    this.handleFoundationEdit = this.handleFoundationEdit.bind(this)
  }

  handleAddFoundation = event => {
    console.log(event)
    this.setState({
      isNew: true
    })
  }

  handleFoundationEdit = foundation => event => {
    
  }

  handleCallManagerDashboard = idFoundtion => event => {
    console.log(idFoundtion)
    axios.get('/get_manager_dashboard', {
      params: {
        foundation_id: idFoundtion
      } 
    })
      .then(res => {
        console.log(res)
        window.location.href = res.request.responseURL
      })
  }

  
  handleDeleteFoundation = idFoundtion => event => {
    console.log(idFoundtion)
    axios.delete('/admin/delete_foundation', { 
      params: {
        id_foundation: idFoundtion,
        authenticity_token: Functions.getMetaContent("csrf-token")
      }
    })
    .then( res => {
      var idFoundtion = res.data.id
      var foundations  = this.state.foundations
      for(let i = 0;i < foundations.length;i++){
        if(foundations[i].id == idFoundtion){
          foundations.splice(i,1)
          this.setState({
            foundations: foundations
          })
          break;
        }
      }
    })
  }

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
      this.setState(state => ({ selected: state.foundations.map(foundation => foundation.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
  };

  handleClose = (event, value)  => {
  }

  handleBack = () => {
    this.setState({
      isNew: false
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };


  isSelected = id => this.state.selected.indexOf(id) !== -1;
  
  render() {
    const { classes } = this.props;
    const { isNew, foundations, order, orderBy, selected, rowsPerPage, page, typeClickMsg, open } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, foundations.length - page * rowsPerPage);
    if(isNew){
      return <NewFoundation handleBack = {this.handleBack}/>
    }
    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar
          handleAddFoundation={this.handleAddFoundation} 
          numSelected={selected.length} 
          selected={selected} 
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={foundations.length}
            />
            <TableBody>
              {stableSort(foundations, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(foundation => {
                  const isSelected = this.isSelected(foundation.id);
                  var status, emailManager
                  if (foundation.managers.length != 0) {
                    emailManager = foundation.managers[0].email
                    status = 'Need Confirmation'
                    foundation.managers.forEach(manager => {
                      if(manager.approve){
                        status = 'Operating'
                      }  
                    });
                  }else {
                    status = 'Not Manager'
                  }
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, foundation.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={foundation.id}
                      selected={isSelected}
                    >
                      <TableCell component="th" scope="row" align="center" padding="none">
                        <Button onClick={(e) => this.props.changePoint(
                          <AdminEditFoundation 
                            foundation={foundation} 
                            current_user={this.props.current_user}
                          />)
                          }>
                        {foundation.name}
                        </Button>
                      </TableCell>
                      <TableCell align="center">{foundation.type_foundation}</TableCell>
                      <TableCell align="center">
                        <a>
                          {emailManager}
                        </a>
                      </TableCell>
                      <TableCell align="center"> {foundation.students.length} </TableCell>
                      <TableCell align="center"> {foundation.address} </TableCell>
                      <TableCell align="center"> {status} </TableCell>
                      <TableCell align="center">
                        <Button size="small" variant="outlined" color="secondary"
                        onClick={this.handleDeleteFoundation(foundation.id)}> Delete </Button>
                        <Button size="small" variant="outlined" component="span"
                        onClick={this.handleCallManagerDashboard(foundation.id)}> Dashboard </Button>
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
          count={foundations.length}
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

FoundationsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FoundationsTable);
