import React, { useState, useContext } from "react";
import "../scss/Register.scss";
import { AppContext } from "../components/Context";
import { useSnackbar } from 'notistack';
import { emailPattern, isError, getErrorText, addError } from "../util/validation";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const Register = () => {
  const { state, dispatch } = useContext(AppContext);

  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (notification) => {
    if (!notification) return;
    enqueueSnackbar(notification.msg, {
      variant: notification.type,
    });
  };

  const initialData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
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
    const { firstName, lastName, email, password, password2 } = data;
    if (!firstName || !lastName || !email || !password || !password2) {
      notification = { type: "warning", msg: "Please enter all fields." };
      console.log(notification, errors);
      return { notification, errors };
    }
    if (firstName.trim().length < 1) {
      errors["firstName"] = addError(errors, "firstName", "This field is required.");
    }
    if (lastName.trim().length < 1) {
      errors["lastName"] = addError(errors, "lastName", "This field is required.");
    }
    if (email.trim().length < 1) {
      errors["email"] = addError(errors, "email", "This field is required.");
    }
    if (!emailPattern.test(email)) {
      errors["email"] = addError(errors, "email", "Must be a valid email address.");
    }
    if (password.length < 8) {
      errors["password"] = addError(errors, "password", "Must be at least 8 characters.");
    }
    if (password !== password2) {
      errors["password2"] = addError(errors, "password2", "Must match password.");
    }
    if (JSON.stringify(errors) !== "{}") {
      notification = { type: "warning", msg: "Please check the fields in error and try again." };
      console.log(notification, errors);
    }
    return { notification, errors };
  }

  const register = async (data) => {
    const { notification, errors } = validateData(data);
    setErrors(errors);
    if (notification || Object.keys(errors).length > 0) {
      addNotification(notification);
      return;
    }
    const res = await fetch(
      state.api + "/users/register",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `data=${JSON.stringify(data)}`,
        mode: "cors",
        cache: "default",
        credentials: "include",
      }
    );
    console.log(res);
    const response = await res.json();
    console.log(response);
    if (response.notification) {
      console.log(response.notification);
      addNotification(response.notification);
    }
    if (res.ok) {
      setupSignIn();
    }
  };

  const setupSignIn = () => {
    dispatch({
      type: "set-registration",
      payload: {
        isRegistration: false,
      }
    });
  }

  return (
    <section>
      <Box
        component="form"
        autoComplete="off"
        style={{ margin: "-6em 0 1em 0" }}
      >
        <div>
          <TextField
            required
            error={isError(errors, "firstName")}
            helperText={getErrorText(errors, "firstName")}
            variant="outlined"
            id="firstName"
            name="firstName"
            label="First Name"
            value={data.firstName}
            onChange={onChangeData}
            inputProps={{ maxLength: 50 }}
            style={{ margin: ".5em" }}
          />
          <TextField
            required
            error={isError(errors, "lastName")}
            helperText={getErrorText(errors, "lastName")}
            variant="outlined"
            id="lastName"
            name="lastName"
            label="Last Name"
            value={data.lastName}
            onChange={onChangeData}
            inputProps={{ maxLength: 50 }}
            style={{ margin: ".5em" }}
          />
        </div>
        <div>
          <TextField
            required
            error={isError(errors, "email")}
            helperText={getErrorText(errors, "email")}
            variant="outlined"
            id="email"
            name="email"
            label="Email"
            value={data.email}
            onChange={onChangeData}
            inputProps={{ maxLength: 255 }}
            style={{ width: "calc(100% - 1em)", margin: ".5em" }}
          />
        </div>
        <div>
          <TextField
            required
            error={isError(errors, "password")}
            helperText={getErrorText(errors, "password")}
            variant="outlined"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={data.password}
            onChange={onChangeData}
            style={{ margin: ".5em" }}
          />
          <TextField
            required
            error={isError(errors, "password2")}
            helperText={getErrorText(errors, "password2")}
            variant="outlined"
            id="password2"
            name="password2"
            label="Confirm Password"
            type="password"
            value={data.password2}
            onChange={onChangeData}
            style={{ margin: ".5em" }}
          />
        </div>
      </Box>
      <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
        <LoadingButton variant="contained" size="large" color="primary"
        onClick={() => register(data)}>
          Register
        </LoadingButton>
        <Button variant="text" size="small" color="primary"
        onClick={() => setupSignIn()}>
          Sign In
        </Button>
      </Stack>
    </section>
  );
};

export default Register;
