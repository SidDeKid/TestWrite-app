import { auth } from "@/model/auth";

const accessToken = auth.accessToken !== null ? auth.accessToken : "";

export const headerHelper = {
  basicHeaders: {
    headers: {
      "Content-Type": "utf-8"
    }
  },
  authHeaders: {
    headers: {
      "Content-Type": "utf-8",
      Authorization: `Bearer ${accessToken}`
    }
  }
};
