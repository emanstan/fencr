import moment from "moment";

const ImageCatalogColumns = [
  { title: "Series", field: "Series", editable: "never" },
  {
    title: "Date",
    field: "Date",
    type: "date",
    render: rowData =>
      moment(rowData.Date)
        .local()
        .format("MM/DD/YYYY")
  },
  {
    title: "Description",
    field: "Description",
    cellStyle: {
      width: "30%"
    },
    headerStyle: {
      width: "30%"
    }
  },
  { title: "Client", field: "Client" },
  { title: "Author", field: "Author" },
  { title: "Model_Serial", field: "Model_Serial" },
  { title: "Registration", field: "Registration" },
  { title: "T_R", field: "T_R" },
  { title: "Code", field: "Code" },
  { title: "Volume", field: "Volume" }
  //{ title: "Home", field: "Home" },
  //{ title: "Team", field: "Team" }
];

export default ImageCatalogColumns;
