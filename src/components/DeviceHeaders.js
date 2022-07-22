import moment from "moment";

const DeviceHeaders = [
  { label: "License", id: "licenseKey", numeric: false, disablePadding: true, editable: "never" },
  { label: "Name", id: "name", numeric: false, disablePadding: true, editable: "never" },
  /* add at a later date - more for a multi-tenet or managed service data model
  { label: "Venue", id: "venue", numeric: false, disablePadding: true, editable: true },
  */
  { label: "Loc.", id: "location", numeric: false, disablePadding: true, editable: true },
  { label: "Status", id: "status", numeric: false, disablePadding: true, editable: "never" },
  /* these should be moved into fencer
  { label: "Pos.", id: "position", numeric: false, disablePadding: true, editable: true },
  */
  { label: "Fencer", id: "fencer", numeric: false, disablePadding: true, editable: "never" },
  { label: "IP", id: "ipAddress", numeric: false, disablePadding: true, editable: "never" },
  {
    label: "Description",
    id: "description",
    numeric: false,
    disablePadding: true,
    editable: true,
    cellStyle: {
      width: "25%"
    },
    headerStyle: {
      width: "30%"
    }
  },
  {
    label: "Last Update",
    id: "lastUpdate",
    numeric: false,
    disablePadding: true,
    editable: "never",
    type: "date",
    render: rowData =>
      moment(rowData.lastUpdate)
        .local()
        .format("MM/DD/YYYY")
  },
];

export default DeviceHeaders;
