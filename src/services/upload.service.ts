import { axiosClient } from "~/libs/axios";

const uploadServices = {
  uploadSingle: (file: any) => {
    const dataFile = new FormData();

    dataFile.append("file", file);

    return axiosClient.post("/upload/upload-single", dataFile, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "text/plain",
      },
    });
  },
  uploadMultil: (files: any[]) => {
    const dataFile = new FormData();

    files.forEach((file) => {
      dataFile.append("files", file);
    });

    return axiosClient.post(`/upload/upload-multiple`, dataFile, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "text/plain",
      },
    });
  },
};

export default uploadServices;
