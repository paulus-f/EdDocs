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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import arrowGenerator from '../../utils/arrowGenerator'
import axios from "axios";
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import AddIcon from '@material-ui/icons/Add';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import InviteForm from './InviteForm';
import Functions from '../../utils/Functions'

let accept = '';
function createData(id, email, first_name, last_name, accept) {
  if (accept)
    accept = <DoneIcon color='primary'/>
  else
    accept = <ClearIcon color='error'/>
  return { id: id, email, first_name, last_name, accept };
}

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
  { id: 'email', numeric: false, disablePadding: true, label: 'E-mail' },
  { id: 'first_name', numeric: true, disablePadding: false, label: 'First name' },
  { id: 'last_name', numeric: false, disablePadding: false, label: 'Last name' },
  { id: 'accept', numeric: false, disablePadding: false, label: 'Accept' }
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
            Invites  
            {props.renderProgress()}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={() => { if (window.confirm('Are you sure?')) props.DeleteInvite()}}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
        <div className='FilterSet'>
        {props.renderFilterSet()}
          <Tooltip title="Invite">
            <IconButton aria-label='Invite form' onClick={props.OpenInviteForm}>
              <AddIcon />
            </IconButton>
          </Tooltip>
          <InviteForm Close={props.OpenInviteForm} foundation_id={props.foundation_id} OpenState={props.OpenState} AddInvite={props.AddInvite}/>
          <Tooltip
          classes={{
            popper: classes.htmlPopper,
            tooltip: classes.htmlTooltip,
          }}
          PopperProps={{
            popperOptions: {
              modifiers: {
                arrow: {
                  enabled: Boolean(props.arrowRef),
                  element: props.arrowRef,
                },
              },
            },
          }}
          title={
            <React.Fragment>
              <Typography color="inherit">Export from file</Typography>
                <div className='Tip'>
                  1. Only with extension <b>CSV</b>.<br/>
                  2. With headers <b>'email'</b>, <b>'first_name'</b>, and <b>'last_name'</b>.<br/>
                  3. Have 3 columns with valid data according to headings.
                </div>
              <span className={classes.arrow} ref={props.handleArrowRef} />
            </React.Fragment>
          }
        >
         <IconButton component='label'>
            <ImportContactsIcon color='action'/>
              <input type="file" accept='.csv' onChange={props.handleChange} style={{display: 'none'}}/>
            </IconButton>
          </Tooltip>
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
  arrowPopper: arrowGenerator(theme.palette.grey[700]),
  arrow: {
    position: 'absolute',
    fontSize: 6,
    width: '3em',
    height: '3em',
    '&::before': {
      content: '""',
      margin: 'auto',
      display: 'block',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    },
  },
  bootstrapPopper: arrowGenerator(theme.palette.common.black),
  bootstrapTooltip: {
    backgroundColor: theme.palette.common.black,
  },
  bootstrapPlacementLeft: {
    margin: '0 8px',
  },
  bootstrapPlacementRight: {
    margin: '0 8px',
  },
  bootstrapPlacementTop: {
    margin: '8px 0',
  },
  bootstrapPlacementBottom: {
    margin: '8px 0',
  },
  htmlPopper: arrowGenerator('#dadde9'),
  htmlTooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    '& b': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
});


class TableOfInvites extends React.Component {
  constructor(props) {
    super(props);
    const invites = this.props.invites
    this.handleChange = this.handleChange.bind(this)
    this.OpenInviteForm = this.OpenInviteForm.bind(this)
    this.DeleteInvite = this.DeleteInvite.bind(this)
    this.renderFilterSet = this.renderFilterSet.bind(this)
    this.openCloseFilters = this.openCloseFilters.bind(this)
    this.handleChangeFilter = this.handleChangeFilter.bind(this)
    this.filterInvites = this.filterInvites.bind(this)
    this.state = {
      order: 'asc',
      orderBy: 'last_name',
      selected: [],
      data: invites.map(function(item) { return createData(item.id, item.email, item.profile.first_name, item.profile.last_name, props.CheckAccept(item)) }),
      page: 0,
      rowsPerPage: 15,
      file: '',
      arrowRef: null,
      open: false,
      inProgress: false,
      openFilters: false,
      selectOnly: 'all',
    };
  }

  openCloseFilters() {
    this.setState({openFilters: !this.state.openFilters})
  }

  handleChangeFilter = event => {
    const name = event.target.name
    this.setState({ [name]: event.target.value });
    if (name == 'selectOnly')
      this.filterInvites(event.target.value)
  };

  filterInvites(value) {
    const checkAccept = this.props.CheckAccept
    axios.post('http://localhost:3000/invites_table/filter', { 
      foundation_id: this.props.foundation.id,
      selectOnly: value,
      authenticity_token: Functions.getMetaContent("csrf-token")
    }).then( res => {
      this.setState({
      data: res.data.map(function(item) { return createData(item.id, item.email, item.profile.first_name, item.profile.last_name, checkAccept(item)) })
    })
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
              onChange={this.handleChangeFilter}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio color="primary" />}
                label="All"
                labelPlacement="end"
              />
              <FormControlLabel
                value="accepted"
                control={<Radio color="primary" />}
                label="Accepted"
                labelPlacement="end"
              />
              <FormControlLabel
                value="notaccepted"
                control={<Radio color="primary" />}
                label="Not accepted"
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>
        </Paper>);
    else
     return ""
    }

  DeleteInvite() {
    const selected = this.state.selected;
    const checkAccept = this.props.CheckAccept
    axios.post(`http://localhost:3000/delete_invite`, { 
      selected,
      foundation_id: this.props.foundation.id,
      selectOnly: this.state.selectOnly,
      authenticity_token: Functions.getMetaContent("csrf-token")
     }).then( res => {
      this.setState({selected: [],
                     data: res.data.map(function(item) { return createData(item.id, item.email, item.profile.first_name, item.profile.last_name, checkAccept(item)) })
    })
    this.props.SetTypeAlert('success')
    this.props.SetMessageAlert('The invites has been delete successfully!')
    this.props.OpenCloseAlert()
  })
   
  }

  OpenInviteForm() {
    this.setState({open: !this.state.open})
  }

  AddInvite(student){
    if (student)  {
      if ( (this.props.CheckAccept(student) && this.state.selectOnly == 'accepted')
         || ( !this.props.CheckAccept(student) && this.state.selectOnly == 'notaccepted')
         || this.state.selectOnly == 'all' ) 
      {
        const data = this.state.data.slice();
        data.push(createData(student.id, student.email, student.profile.first_name, student.profile.last_name, this.props.CheckAccept(student)));
        this.setState({data: data})
      }
    }
    this.props.SetTypeAlert('success')
    this.props.SetMessageAlert('The student has been invited successfully!')
    this.props.OpenCloseAlert()
  }

  handleChange(e) {
    const checkAccept = this.props.CheckAccept
    const reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    this.setState({inProgress: true})
    reader.onloadend = () => {
      file = reader.result
      axios.post(`http://localhost:3000/upload`, { 
        file,
        selectOnly: this.state.selectOnly,
        foundation_id: this.props.foundation.id,
        authenticity_token: Functions.getMetaContent("csrf-token")
        }).then(res => {
            this.setState({
              inProgress: false,
              data: JSON.parse(res.data.students).map(function(item) { return createData(item.id, item.email, item.profile.first_name, item.profile.last_name, checkAccept(item))})
            })
            this.props.SetTypeAlert(res.data.alertType)
            this.props.SetMessageAlert(res.data.alertMessage)
            this.props.OpenCloseAlert()
          })
        }
  }

  renderProgress() {
    if (this.state.inProgress === false) {
      return null;
    }
    return (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
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
          OpenInviteForm={this.OpenInviteForm}
          arrowRef={this.state.arrowRef}
          handleArrowRef={this.handleArrowRef}
          handleChange={this.handleChange}
          openCloseFilters={this.openCloseFilters}
          renderFilterSet = {this.renderFilterSet}
          AddInvite={this.AddInvite.bind(this)}
          foundation_id={this.props.foundation.id}
          OpenState={this.state.open}
          DeleteInvite={this.DeleteInvite.bind(this)}
          renderProgress={this.renderProgress.bind(this)}/>
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
                      <TableCell component="th" scope="row" padding="none">
                        {n.email}
                      </TableCell>
                      <TableCell align="right" >{n.first_name}</TableCell>
                      <TableCell align="left" >{n.last_name}</TableCell>
                      <TableCell align="left" >{n.accept}</TableCell>
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

TableOfInvites.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableOfInvites);