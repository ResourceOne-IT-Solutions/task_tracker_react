import React from "react";
import httpMethods from "../api/Service";
import { Status } from "../modals/UserModals";
import { BlueDot, GreenDot, OrangeDot, RedDot } from "./Dots/Dots";

export function calculateWorkingFrom(joinDate: any) {
  const currentDate = new Date();
  const joinDateObj = new Date(joinDate);

  if (isNaN(joinDateObj.getTime())) {
    return {
      years: 0,
      months: 0,
      days: 0,
    };
  }
  const timeDiff = currentDate.getTime() - joinDateObj.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const daysDiff = Math.floor(timeDiff / oneDay);
  const years = Math.floor(daysDiff / 365);
  const remainingDays = daysDiff % 365;
  const months = Math.floor(remainingDays / 30);
  const remainingDaysAfterMonths = remainingDays % 30;
  return {
    years,
    months,
    days: remainingDaysAfterMonths,
  };
}
export const setCookie = (cvalue: string) => {
  const d = new Date();
  d.setTime(d.getTime() + 8 * 60 * 60000);
  const expires = "expires=" + d.toUTCString();
  document.cookie =
    "presentTaskUser" + "=" + cvalue + ";" + expires + ";path=/";
};

export const cookieComp = (): string => {
  const getCookie = (cname: string) => {
    const totalCookie = document.cookie.split(";");
    const ca = totalCookie.find((val) => val.includes(cname)) as string;
    if (ca) {
      const cv = ca.split("=");
      return cv[1];
    }
    return null;
  };
  const checkCookie = () => {
    const user = getCookie("presentTaskUser");
    if (user) {
      return user;
    } else {
      setCookie("");
      return "";
    }
  };
  return checkCookie();
};

export function getData<T>(url: string): Promise<T[]> {
  return httpMethods.get(`/${url}`);
}

export const statusIndicator = (status: Status) => {
  if (status === "Available") {
    return <GreenDot />;
  } else if (status === "Break") {
    return <OrangeDot />;
  } else if (status === "On Ticket") {
    return <BlueDot />;
  } else {
    return <RedDot />;
  }
};
interface FullNameType {
  firstName: string;
  lastName: string;
}

export const getFullName = (user: FullNameType) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return "Invalid name";
};
export type DateType = "date" | "time";
export const getFormattedTime = (type?: DateType) => {
  const d = new Date().toLocaleString().split(" ");
  const t = d[1].slice(0, -3);
  const time = t + " " + d[2];
  return time;
};

export const getFormattedDate = (date: Date, format?: string) => {
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  switch (format) {
    case "dd/mm/yyyy": {
      return `${day}/${month}/${year}`;
    }
    case "yyyy/mm/dd": {
      return `${year}/${month}/${day}`;
    }
    default: {
      return `${month}/${day}/${year}`;
    }
  }
};
export const getCurrentDate = (num?: number) => {
  const currentDate = new Date();
  if (num) {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
  }
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
