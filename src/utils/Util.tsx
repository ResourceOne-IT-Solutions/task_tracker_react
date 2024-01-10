export const setCookie = (cvalue: string, exdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    "presentTaskUser" + "=" + cvalue + ";" + expires + ";path=/";
};

export const cookieComp = (): string => {
  const getCookie = (cname: string) => {
    let totalCookie = document.cookie.split(";");
    let ca = totalCookie.find((val) => val.includes(cname)) as string;
    if (ca) {
      const cv = ca.split("=");
      return cv[1];
    }
    return null;
  };
  const checkCookie = () => {
    let user = getCookie("presentTaskUser");
    if (user) {
      return user;
    } else {
      setCookie("63daa3b51d791ebc79fdff21db51", 2);
      return "";
    }
  };
  return checkCookie();
};
