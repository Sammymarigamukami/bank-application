export function isTokenValid(role: string) {
  const storedRole = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const tokenExpiration = localStorage.getItem("tokenExpiration");

  if (!token || storedRole !== role) return false;
  if (Date.now() > Number(tokenExpiration)) return false;
  return true;
}

export const customerLoggedIn = () => isTokenValid("customer");
export const employeeLoggedIn = () => isTokenValid("employee");
export const managerLoggedIn = () => isTokenValid("manager");