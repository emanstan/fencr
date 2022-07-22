import React, { useState, useContext } from "react";
import "../scss/SignIn.scss";
import { AppContext } from "../components/Context";
import { useSnackbar } from 'notistack';
import { emailPattern, isError, getErrorText, addError } from "../util/validation";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

const SignIn = () => {
  const { state, dispatch } = useContext(AppContext);

  const { enqueueSnackbar } = useSnackbar();

  const addNotification = (notification) => {
    if (!notification) return;
    enqueueSnackbar(notification.msg, {
      variant: notification.type,
    });
  };

  const initialData = {
    email: "",
    password: "",
    showPassword: false,
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
    const { email, password } = data;
    if (!email || !password) {
      notification = { type: "warning", msg: "Please enter all fields." };
      console.log(notification, errors);
      return { notification, errors };
    }
    if (email.trim().length < 1) {
      errors["email"] = addError(errors, "email", "This field is required.");
    }
    if (!emailPattern.test(email)) {
      errors["email"] = addError(errors, "email", "Must be a valid email address.");
    }
    if (password.trim().length < 1) {
      errors["password"] = addError(errors, "password", "This field is required.");
    }
    if (JSON.stringify(errors) !== "{}") {
      notification = { type: "warning", msg: "Please check the fields in error and try again." };
      console.log(notification, errors);
    }
    return { notification, errors };
  }

  const signIn = async (data) => {
    const { notification, errors } = validateData(data);
    setErrors(errors);
    if (notification || Object.keys(errors).length > 0) {
      addNotification(notification);
      return;
    }
    const res = await fetch(
      state.api + "/users/signin",
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
    if (!res) {
      dispatch({ type: "reset" });
      return;
    }
    const response = await res.json();
    console.log(response);
    if (res.ok && response && response.token) {
      dispatch({
        type: "set-app-context",
        payload: {
          isAuth: true,
          isRegistration: false,
          token: response.token,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
        }
      });
    }
    else {
      dispatch({ type: "reset" });
    }
    /* no need to display notification, visual transformation takes care of it
    if (response.notification) {
      console.log(response.notification);
      addNotification(response.notification);
    }
    */
  };

  const setupRegistration = () => {
    dispatch({
      type: "set-registration",
      payload: {
        isRegistration: true,
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
            type={data.showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={data.password}
            onChange={onChangeData}
            style={{ width: "calc(100% - 1em)", margin: ".5em" }}
          />
        </div>
      </Box>
      <Stack spacing={3} direction="column" alignItems="center" justifyContent="center">
        <LoadingButton variant="contained" size="large" color="primary"
        onClick={() => signIn(data)}>
          Sign In
        </LoadingButton>
        <Button variant="text" size="small" color="primary"
        onClick={() => setupRegistration()}>
          Register
        </Button>
      </Stack>
    </section>
  );
};

export default SignIn;
