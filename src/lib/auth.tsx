import { api } from "@/libs/axios/api";

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<string> => {
  const { data: msg } = await api.post<string>("/auth/register", data);
  return msg;
};

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const { data: token } = await api.post<string>("/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", token);
  return token;
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
