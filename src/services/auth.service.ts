import { axiosClient } from "~/libs/axios";

const authServices = {
  login: (payload: { username: string; password: string }) => {
    return axiosClient.post(`/auth/login`, payload);
  },
  getProfile: () => {
    return axiosClient.get(`/auth/get-profile`);
  },
};

export default authServices;
