import { Metadata } from "next";
import MainLogin from "~/page/auth/MainLogin";

export const metadata: Metadata = {
  title: "Đăng nhập hệ thống",
  description: "Đăng nhập hệ thống",
};

export default function Page() {
  return <MainLogin />;
}
