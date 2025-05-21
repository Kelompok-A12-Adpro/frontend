import api from "./api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const register = async ({
  name,
  email,
  password,
  phone,
}: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  const response = await api.post("/register", {
    name,
    email,
    password,
    phone,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
