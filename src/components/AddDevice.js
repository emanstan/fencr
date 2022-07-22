import React, { useState, /*useEffect, */useContext } from "react";
import "../scss/AddEntry.scss";
import { makeStyles } from "@mui/styles";
import { AppContext } from "../components/Context";
import { useSnackbar } from 'notistack';
import { isError, getErrorText, addError } from "../util/validation";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
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
//import InputLabel from "@mui/material/InputLabel";
//import MenuItem from "@mui/material/MenuItem";
//import FormControl from "@mui/material/FormControl";
//import Select from "@mui/material/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: "16px",
    marginBottom: "8px",
    minWidth: 120
  }
}));

const AddDevice = ({ handleRefresh }) => {
  const { state } = useContext(AppContext);

  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (notification) => {
    if (!notification) return;
    enqueueSnackbar(notification.msg, {
      variant: notification.type,
    });
  };

  const initialData = {
    licenseKey: "",
    name: "",
    venue: "",
    description: "",
  };

  const [data, setData] = useState(initialData);

  const initialErrors = {};

  const [errors, setErrors] = useState(initialErrors);
  
  const onChangeData = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateData = (data) => {
    let notification = null, errors = initialErrors;
    const { licenseKey, name } = data;
    if (!licenseKey || !name) {
      notification = { type: "warning", msg: "Please enter all fields." };
      console.log(notification, errors);
      return { notification, errors };
    }
    if (licenseKey.trim().length < 1) {
      errors["licenseKey"] = addError(errors, "licenseKey", "This field is required.");
    }
    if (name.trim().length < 1) {
      errors["name"] = addError(errors, "name", "This field is required.");
    }
    if (JSON.stringify(errors) !== "{}") {
      notification = { type: "warning", msg: "Please check the fields in error and try again." };
      console.log(notification, errors);
    }
    return { notification, errors };
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setData(initialData);
    setOpen(false);
  };

  const handleAdd = () => {
    console.log("form data ", data);
    const { notification, errors } = validateData(data);
    setErrors(errors);
    if (notification || Object.keys(errors).length > 0) {
      addNotification(notification);
      return;
    }
    createEntry(data)
      .then(response => {
        console.log(response);
        if (response.notification) {
          console.log(response.notification);
          addNotification(response.notification);
        }
        setData(initialData);
        setOpen(false);
        handleRefresh();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const createEntry = async (data) => {
    const res = await fetch(
      state.api + "/devices/register",
      {
        method: "POST",
        headers: new Headers({
          Authorization: "Bearer " + state.token,
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `data=${JSON.stringify(data)}`,
        mode: "cors",
        cache: "default",
        credentials: "include"
      }
    );
    return res.json();
  };

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

      <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={handleClose} aria-labelledby="add-title">
        <DialogTitle id="add-title">Add New</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ paddingBottom: '.5em' }}>Add a new device.</DialogContentText>
          <div>
            <TextField
              required
              error={isError(errors, "licenseKey")}
              helperText={getErrorText(errors, "licenseKey")}
              variant="outlined"
              id="licenseKey"
              name="licenseKey"
              label="License Key"
              value={data.licenseKey}
              onChange={onChangeData}
              inputProps={{ maxLength: 50 }}
              style={{ width: "calc(100% - 1em)", margin: ".5em" }}
            />
          </div>
          <div>
            <TextField
              required
              error={isError(errors, "name")}
              helperText={getErrorText(errors, "name")}
              variant="outlined"
              id="name"
              name="name"
              label="Name"
              value={data.name}
              onChange={onChangeData}
              inputProps={{ maxLength: 50 }}
              style={{ width: "calc(100% - 1em)", margin: ".5em" }}
            />
          </div>
          <div>
            <TextField
              error={isError(errors, "venue")}
              helperText={getErrorText(errors, "venue")}
              variant="outlined"
              id="venue"
              name="venue"
              label="Venue"
              value={data.venue}
              onChange={onChangeData}
              inputProps={{ maxLength: 50 }}
              style={{ width: "calc(100% - 1em)", margin: ".5em" }}
            />
          </div>
          <div>
            <TextField
              error={isError(errors, "description")}
              helperText={getErrorText(errors, "description")}
              variant="outlined"
              id="description"
              name="description"
              label="Description"
              value={data.description}
              onChange={onChangeData}
              inputProps={{ maxLength: 50 }}
              style={{ width: "calc(100% - 1em)", margin: ".5em" }}
            />
          </div>
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
          {/*
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
          */}
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

export default AddDevice;

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
