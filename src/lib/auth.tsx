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
  const response = await api.post<string>("/auth/login", { email, password });
  const token = response.data;

  localStorage.setItem("token", token);

  document.cookie = `token=${token}; path=/; samesite=strict`;

  return token;
};

export const logout = () => {
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; max-age=0";
};
