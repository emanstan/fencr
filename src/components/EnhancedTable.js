import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  //console.log("array =", array);
  if (!Array.isArray(array)) return [];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// TableHead
function EnhancedTableHead(props) {
  const {
    headers,
    order, orderBy,
    numSelected, rowCount,
    key,
    onSelectAllClick,
    onRequestSort,
    onEdit,
    onDelete,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {onDelete ?
          <TableCell key="delete" padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all',
              }}
            />
          </TableCell>
          :
          null
        }
        {onEdit ?
          <TableCell key="edit" padding="checkbox">
            <IconButton
              color="primary"
              style={{
                'visibility': 'hidden',
              }}
            >
              <EditIcon />
            </IconButton>
          </TableCell>
          :
          null
        }
        {headers.map((header) => (
          <TableCell
            key={header.id}
            align={header.numeric ? 'right' : 'left'}
            padding={header.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === header.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === header.id}
              direction={orderBy === header.id ? order : 'asc'}
              onClick={createSortHandler(header.id)}
            >
              {header.label}
              {orderBy === header.id ?
                (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                )
                :
                null
              }
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  headers: PropTypes.array.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

// Toolbar
const EnhancedTableToolbar = (props) => {
  const {
    title,
    numSelected,
    searchText,
    searchChange,
  } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        /*
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        */
        <TextField
          variant="standard"
          value={searchText}
          onChange={(event) => searchChange(event, event.target.value)}
          placeholder="Search…"
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                style={{ visibility: searchText ? 'visible' : 'hidden' }}
                onClick={(event) => searchChange(event, '')}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto',
            },
            m: (theme) => theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
              mr: 0.5,
            },
            '& .MuiInput-underline:before': {
              borderBottom: 1,
              borderColor: 'divider',
            },
          }}
        />
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  numSelected: PropTypes.number.isRequired,
  searchText: PropTypes.string,
  searchChange: PropTypes.func,
};

// TableRowCells
const EnhancedTableRowCells = (props) => {
  const { headers, row } = props;
  if (!headers || !row) return null;
  {headers.map((item, index) => {
    console.log(item, row);
    return (
      <TableCell
        component="td"
        id={`${item._id}_${index}`}
        scope="row"
        padding="none"
      >
        {row.hasOwnProperty(item.field) ? row[item.field] : null}
      </TableCell>
    );
  })}
}

EnhancedTableRowCells.propTypes = {
  headers: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
};

// Table
export default function EnhancedTable(props) {
  //console.log("props =", props);
  const { title, headers, rows, onEdit, onDelete } = props;
  //console.log("rows =", rows);
  
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredRows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleSearch = (event, searchValue) => {
    setSearchText(searchValue);
    if (!rows || !Array.isArray(rows)) return;
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) => {
        if (!row[field]) return false;
        return searchRegex.test(row[field].toString());
      });
    });
    setFilteredRows(filteredRows);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  // Don't display edit icon if no values are editable
  const hasEditableValues = 
    headers && headers.some((item) => item && item.hasOwnProperty('editable') && item.editable === true);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          title={title}
          numSelected={selected.length}
          searchText={searchText}
          searchChange={handleSearch}
           />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              headers={headers}
              order={order}
              orderBy={orderBy}
              numSelected={selected.length}
              rowCount={filteredRows.length}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              onEdit={onEdit}
              onDelete={onDelete}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIndex) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${rowIndex}`;

                  return (
                    <TableRow
                      hover
                      //onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      {onDelete ?
                        <TableCell key={`delete${rowIndex}`} padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            /* moved from above */
                            onClick={(event) => handleClick(event, row.name)}
                            /* */
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        :
                        null
                      }
                      {onEdit && hasEditableValues ?
                        <TableCell key={`edit${rowIndex}`} padding="checkbox">
                          <IconButton
                            color="primary"
                            onClick={(event) => onEdit(event, row)}
                            /*inputProps={{
                              'aria-labelledby': labelId,
                            }}*/
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        :
                        null
                      }
                      {headers.map((item, index) => {
                        //console.log(item, row);
                        let cellStyle = item.cellStyle;
                        if (item.disablePadding) {
                          cellStyle = {...item.cellStyle, padding: 0 }
                        }
                        return (
                          <TableCell
                            key={`${item.id}${index}`}
                            className={item.cellClassName || ""}
                            style={cellStyle}
                          >
                            {row.hasOwnProperty(item.id) ? (item.hasOwnProperty("render") ? item.render(row) : row[item.id]) : null}
                          </TableCell>
                        )
                      })}
                      {/*<EnhancedTableRowCells headers={headers} row={row} />*/}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={headers.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}