import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
//import DateFnsUtils from "@date-io/date-fns";
//import {
//  MuiPickersUtilsProvider,
//  KeyboardDatePicker
//} from "@material-ui/pickers";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AppContext } from "../components/Context";

import "../scss/AddEntry.scss";

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: "16px",
    marginBottom: "8px",
    minWidth: 120
  }
}));

const AddEntry = ({ handleRefresh }) => {
  const { state } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [authorList, setAuthorList] = useState([]);

  const initialEntry = {
    location: "",
    position: "",
    description: "",
  };

  const [entry, setEntry] = useState(initialEntry);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEntry(initialEntry);
    setOpen(false);
  };

  const handleAdd = () => {
    //console.log("form data ", entry);
    createEntry(entry)
      .then(res => {
        setEntry(initialEntry);
        setOpen(false);
        handleRefresh();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const createEntry = async data => {
    const date = data.date || "";
    const res = await fetch(
      process.env.REACT_APP_BACK + "/private/imagecatalog/create",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + state.token,
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `data=${JSON.stringify(data)}&date=${date}`,
        mode: "cors",
        cache: "default",
        credentials: "include"
      }
    );
    return res.json();
  };

  useEffect(() => {
    const getAuthors = async () => {
      const res = await fetch(process.env.REACT_APP_BACK + "/private/users", {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + state.token,
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: "",
        mode: "cors",
        cache: "default",
        credentials: "include"
      });
      return res.json();
    };
    getAuthors()
      .then(res => {
        //console.log("This is authord ", res.list);
        setAuthorList(res.list);
      })
      .catch(err => {
        setAuthorList([]);
        console.error(err);
      });
  }, [state]);

  return (
    <>
      <Fab
        onClick={handleClickOpen}
        className="add-cat"
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={handleClose} aria-labelledby="add-title">
        <DialogTitle id="add-title">Add New</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a new alpha series.</DialogContentText>

          {/*
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              required
              className="addentry"
              margin="normal"
              id="date-picker-dialog"
              label="Date"
              format="yyyy-MM-dd"
              value={entry.date}
              onChange={d => {
                setEntry({ ...entry, date: d });
              }}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
          */}

          <FormControl className={classes.formControl + " addentry"} required>
            <InputLabel id="author-label">Author</InputLabel>
            <Select
              labelId="author-label"
              id="author-select"
              value={entry.author}
              onChange={e =>
                setEntry({
                  ...entry,
                  author: e.target.value
                })
              }
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {authorList.map((author, index) => {
                return (
                  <MenuItem key={index} value={author}>
                    {author}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <TextField
            required
            id="description"
            label="Description"
            multiline
            rowsMax="4"
            value={entry.description}
            onChange={e =>
              setEntry({
                ...entry,
                description: e.target.value
              })
            }
            className="full-width"
          />

          <TextField
            id="client"
            label="Client"
            className="full-width"
            value={entry.client}
            onChange={e =>
              setEntry({
                ...entry,
                client: e.target.value
              })
            }
          />

          <TextField
            id="model_serial"
            label="Model / Serial"
            className="addentry"
            value={entry.modelSerial}
            onChange={e =>
              setEntry({
                ...entry,
                modelSerial: e.target.value
              })
            }
          />

          <TextField
            id="registration"
            label="Reg#"
            className="addentry"
            value={entry.registration}
            onChange={e =>
              setEntry({
                ...entry,
                registration: e.target.value
              })
            }
          />

          <TextField
            id="t_r"
            label="T_R"
            className="addentry"
            value={entry.tr}
            onChange={e =>
              setEntry({
                ...entry,
                tr: e.target.value
              })
            }
          />

          <TextField
            id="code"
            label="Code"
            className="addentry"
            value={entry.code}
            onChange={e =>
              setEntry({
                ...entry,
                code: e.target.value
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddEntry;

/*

   <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>

<FormControl className={classes.dateControl} required>
  <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <KeyboardDatePicker
      margin="normal"
      id="date-picker-dialog"
      label="Date"
      format="yyyy-MM-dd"
      value={selectedDate}
      onChange={handleDateChange}
      KeyboardButtonProps={{
        "aria-label": "change date"
      }}
    />
  </MuiPickersUtilsProvider>
</FormControl>
  <FormControl className={classes.formControl} required>
    <InputLabel id="author-label">Author</InputLabel>
    <Select
      labelId="author-label"
      id="author-select"
      value={author}
      onChange={handleAuthorChange}
      className={classes.selectEmpty}
    >
      <MenuItem value="">
        <em>Select</em>
      </MenuItem>
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
  </FormControl>

  <FormControl className={classes.formControl} required>
    <TextField
      id="description"
      label="Description"
      multiline
      rowsMax="4"
      value={description}
      onChange={handleDescriptionChange}
    />
  </FormControl>
*/
