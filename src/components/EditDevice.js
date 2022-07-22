import React, { useState, useEffect, useContext } from "react";
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

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: "16px",
    marginBottom: "8px",
    minWidth: 120
  }
}));

const EditDevice = ({ row, onClose, handleRefresh }) => {
  console.log("editRow =", row);
  const { state } = useContext(AppContext);

  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (notification) => {
    if (!notification) return;
    enqueueSnackbar(notification.msg, {
      variant: notification.type,
    });
  };

  const [data, setData] = useState(null);
  console.log("data =", data);

  const initialErrors = {};

  const [errors, setErrors] = useState(initialErrors);
  
  const onChangeData = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateData = (data) => {
    let notification = null, errors = initialErrors;
    const { venue, location, description } = data;
    if (JSON.stringify(errors) !== "{}") {
      notification = { type: "warning", msg: "Please check the fields in error and try again." };
      console.log(notification, errors);
    }
    return { notification, errors };
  }

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setData(row);
    setOpen(row != null);
  }, [row]);

  const onSave = () => {
    console.log("form data ", data);
    const { notification, errors } = validateData(data);
    setErrors(errors);
    if (notification || Object.keys(errors).length > 0) {
      addNotification(notification);
      return;
    }
    editEntry(data)
      .then(response => {
        console.log(response);
        if (response.notification) {
          console.log(response.notification);
          addNotification(response.notification);
        }
        setData(null);
        setOpen(false);
        handleRefresh();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const editEntry = async (data) => {
    const res = await fetch(
      state.api + "/devices/save",
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

  if (!data) return "";

  return (
    <>
      <Dialog fullWidth={true} maxWidth={"sm"} open={open} onClose={onClose} aria-labelledby="add-title">
        <DialogTitle id="add-title">Edit {data.name}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ paddingBottom: '.5em' }}>Edit an existing device.</DialogContentText>
          <div>
            <TextField
              readOnly
              disabled
              variant="outlined"
              id="licenseKey"
              name="licenseKey"
              label="License Key"
              value={data.licenseKey}
              style={{ width: "calc(100% - 1em)", margin: ".5em" }}
            />
          </div>
          {/* add at a later date - more for a multi-tenet or managed service data model
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
          */}
          <div>
            <TextField
              error={isError(errors, "location")}
              helperText={getErrorText(errors, "location")}
              variant="outlined"
              id="location"
              name="location"
              label="Location"
              value={data.location}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={onSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditDevice;
