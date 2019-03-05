import axios from "axios";

export default class apiProvider {
  getDataFromDb = () => axios.get("/api/getData")
    .then(data => data.json())
    .then(res => this.setState({ data: res.data }));

  putDataToDB = message => axios.post("/api/putData", {
    message: message
  });

  deleteFromDB = idTodelete =>
    axios.delete("/api/deleteData", {
      data: {
        id: idTodelete
      }
    });

  updateDB = (idToUpdate, updateToApply) =>
    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
}
