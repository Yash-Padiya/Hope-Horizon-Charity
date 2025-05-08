export const getCookie = (name: string): Record<string, any> | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    if (!cookieValue) return null;

    try {
      return JSON.parse(decodeURIComponent(cookieValue));
    } catch (error) {
      console.error("Error parsing cookie:", error);
      return null;
    }
  }

  return null;
};
export const removeCookie = (): void => {
  document.cookie = `authData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
