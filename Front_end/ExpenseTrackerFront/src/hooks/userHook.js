// hooks/useUser.js
export function useUser() {
  const user = JSON.parse(sessionStorage.getItem("credential"));
  const userId = sessionStorage.getItem("userId");
  return { user, userId };
}
