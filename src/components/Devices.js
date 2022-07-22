import React, { useContext, useState, useEffect } from "react";
import "../scss/Main.scss";
import { AppContext } from "../components/Context";
import { useSnackbar } from 'notistack';
import { isError, getErrorText, addError } from "../util/validation";
import DeviceHeaders from "./DeviceHeaders";
//import MaterialTable from "material-table";
import AddDevice from "./AddDevice";
import EnhancedTable from "./EnhancedTable";
import EditDevice from "./EditDevice";

const Main = () => {
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
    if (!name.trim().length < 1) {
      errors["name"] = addError(errors, "name", "This field is required.");
    }
    if (JSON.stringify(errors) !== "{}") {
      notification = { type: "warning", msg: "Please check the fields in error and try again." };
      console.log(notification, errors);
    }
    return { notification, errors };
  };

  const [query, setQuery] = useState({ page: 1, pageSize: 25, search: null, filters: null });
  const [rows, setRows] = useState([]);
  const [editRow, setEditRow] = useState(null);

  const tableRef = React.createRef();

  const onRefresh = () => {
    tableRef.current.onQueryChange();
  };

  const onEdit = (event, editRow) => {
    console.log("onEdit: ", editRow);
    setEditRow(editRow);
  };

  const updateData = async (data) => {
    const res = await fetch(
      state.api + "/devices/update",
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${state.token}`,
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

  const getRows = async (query) => {
    console.log("queryParams =", query);
    let notification = null;
    let errors = [];
    setErrors(errors);
    if (notification || Object.keys(errors).length > 0) {
      addNotification(notification);
      return;
    }
    const page = query.page || 0;
    const pageSize = query.pageSize || 5;
    const search = query.search || "";
    const filters = query.filters || "";
    console.log(state.api + "/devices/page/" + page);
    const res = await fetch(
      //`${state.api}/devices/page/${page}?pagesize=${pageSize}&search=${search}&filters=${JSON.stringify(filters)}`
      ///*
      state.api + "/devices/page/" + page,
      {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }),
        body: `pagesize=${pageSize}&search=${search}&filters=${JSON.stringify(filters)}`,
        mode: "cors",
        cache: "default",
        credentials: "include"
      }
      //*/
    );
    console.log(res);
    const response = await res.json();
    console.log(response);
    if (res.ok && response) {
      const rows = response.rows.map(item => item.doc);
      console.log(rows);
      setRows(rows);
    }
    else {
      setRows([])
    }
  };

  useEffect(() => {
    getRows(query);
  }, []);

  return (
    <section>
      <EnhancedTable
        title="Devices"
        headers={DeviceHeaders}
        rows={rows}
        onEdit={onEdit}
        onDelete={null}
        /*
        rows={query =>
          new Promise((resolve, reject) => {
            // prepare your data and then call resolve like this:
            getAll(query)
              .then(res => {
                console.log("DATA ", res.rows);
                console.log("COUNT ", res.count);
                console.log("QUERY ", query);
                resolve({
                  data: res.rows.map,
                  page: query.page,
                  totalCount: res.total_rows,
                });
              })
              .catch(err => {
                reject(err);
              });
          })
        }
        */
      />
      {/*<MaterialTable
        tableRef={tableRef}
        options={{
          filtering: true,
          debounceInterval: 750,
          exportButton: true,
          pageSizeOptions: [5, 10, 50, 100, 200]
        }}
        columns={DeviceColumns}
        title="Devices"
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                //console.log("this is old ", oldData);
                //console.log("this is new ", newData);
                updateAll(newData)
                  .then(res => resolve())
                  .catch(err => {
                    reject(err);
                  });
              }, 1000);
            })
        }}
        data={query =>
          new Promise((resolve, reject) => {
            // prepare your data and then call resolve like this:
            getAll(query.page, query.pageSize, query.search, query.filters)
              .then(res => {
                //console.log("DATA ", res.rows);
                //console.log("COUNT ", res.count);
                //console.log("QUERY ", query);
                resolve({
                  data: res.rows,
                  page: query.page,
                  totalCount: res.count
                });
              })
              .catch(err => {
                reject(err);
              });
          })
        }
      />*/}
      <AddDevice handleRefresh={onRefresh} />
      <EditDevice row={editRow} onClose={() => setEditRow(null)} handleRefresh={onRefresh} />
    </section>
  );
};

export default Main;
