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
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Functions from '../../utils/Functions'
import axios from "axios";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

let accept = '';
function createData(id, first_name, last_name, group, level) {
  const full_name = last_name+ ' ' + first_name 
  let group_name;
  let level_name;
  if (group != "")
  {
    group_name = group.name
    level_name = level.name
  } 
  if (accept)
    accept = <DoneIcon color='primary'/>
  else
    accept = <ClearIcon color='error'/>
  return { id: id, full_name, level_name, group_name };
}

function desc(a, b, orderBy) {
  if (!a[orderBy] && !b[orderBy])
    return 0
  if (!a[orderBy] || b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (!b[orderBy] || b[orderBy] > a[orderBy]) {
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
  { id: 'full_name', numeric: false, disablePadding: false, label: 'Full name' },
  { id: 'level_name', numeric: false, disablePadding: false, label: 'Level' },
  { id: 'group_name', numeric: false, disablePadding: false, label: 'Group' },
  { id: 'view_info', numeric: false, disablePadding: false, label: 'Info' },
];

class EnhancedTableHead extends React.Component {
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
                align={row.numeric ? 'right' : 'left'}
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
  const { numSelected, classes } = props;
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
          <Typography variant="h6" id="tableTitle" >
            Students
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={() => { if (window.confirm('Are you sure?')) props.kickStudent()}}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
        <div className='FilterSet'>
        {props.renderFilterSet()}
          <Tooltip title="Filter list">
              <IconButton aria-label="Filter list" onClick={props.openCloseFilters}>
                <FilterListIcon />
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
  button: {
    margin: theme.spacing.unit,
  },
  lightTooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
});


class TableOfStudents extends React.Component {
  constructor(props) {
    super(props);
    const students = this.props.students
    this.state = {
      order: 'asc',
      orderBy: 'full_name',
      selectOnly: 'all',
      openFilters: false,
      selected: [],
      data: students.map(function(item) { return createData(item.id, item.profile.first_name, item.profile.last_name, item.group, item.level) }),
      page: 0,
      rowsPerPage: 15,
      file: '',
      arrowRef: null,
      open: false,
      inProgress: false,
    };
    this.renderFilterSet = this.renderFilterSet.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.openCloseFilters = this.openCloseFilters.bind(this)
    this.filterStudents = this.filterStudents.bind(this)
  }

  handleChange = event => {
    const name = event.target.name
    this.setState({ [name]: event.target.value });
    if (name == 'selectOnly')
      this.filterStudents(event.target.value)
  };


  openCloseFilters() {
    this.setState({openFilters: !this.state.openFilters})
  }

  filterStudents(value) {
    axios.post('http://localhost:3000/students_table/filter', { 
      foundation_id: this.props.foundation.id,
      selectOnly: value,
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then( res => {
      this.setState({
      data: this.parseData(res.data.students) })
    })
  }

  renderFilterSet() {
  if (this.state.openFilters)
    return (   
    <Paper>
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
              value="group"
              control={<Radio color="primary" />}
              label="With group"
              labelPlacement="end"
            />
            <FormControlLabel
              value="notgroup"
              control={<Radio color="primary" />}
              label="Without group"
              labelPlacement="end"
            />
          </RadioGroup>
        </FormControl>
      </Paper>);
  else
   return ""
  }

  kickStudent() {
    const selected = this.state.selected;
    axios.post('http://localhost:3000/students_table/kick', { 
      selected,
      foundation_id: this.props.foundation.id,
      selectOnly: this.state.selectOnly,
      authenticity_token: Functions.getMetaContent("csrf-token")
     }).then( res => {
      this.setState({selected: [],
                     data: this.parseData(res.data.students) })
    this.props.SetTypeAlert('success')
    this.props.SetMessageAlert('The students has been kicked successfully!')
    this.props.OpenCloseAlert()
  })
  }

  parseData(students) {
   return students.map(function(item) { return createData(item.id, item.profile.first_name, item.profile.last_name, item.group, item.level) })
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
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
    <div className="col-md-10 StudentsTable">
      <Paper >
        <EnhancedTableToolbar 
          numSelected={selected.length}
          kickStudent={this.kickStudent.bind(this)}
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
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell align="left">{n.full_name}</TableCell>
                      <TableCell align="left">{n.level_name}</TableCell>
                      <TableCell align="left">{n.group_name}</TableCell>
                      <TableCell align="left">
                        <Tooltip title="View info" >
                          <a href={'/children/show?id=' + n.id}>
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
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={data.length}
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
      </div>
    );
  }
}

TableOfStudents.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableOfStudents);