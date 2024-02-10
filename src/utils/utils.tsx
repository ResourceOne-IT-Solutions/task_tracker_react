import React, { useEffect, useState } from "react";
import httpMethods from "../api/Service";
import {
  NameIdInterface,
  Status,
  UserContext,
  UserModal,
} from "../modals/UserModals";
import { BlueDot, GreenDot, OrangeDot, RedDot } from "./Dots/Dots";
import { BE_URL, TOKEN } from "./Constants";
import { useUserContext } from "../components/Authcontext/AuthContext";
import { Severity } from "./modal/notification";

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
export const setCookie = (cvalue: string, hours: number) => {
  const d = new Date();
  d.setTime(d.getTime() + hours * 60 * 60000);
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
      setCookie("", 8);
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
    return <GreenDot title={status} />;
  } else if (status === "Break") {
    return <OrangeDot title={status} />;
  } else if (status === "On Ticket") {
    return <BlueDot title={status} />;
  } else if (status === "Offline") {
    return <RedDot title={status} />;
  }
};
interface FullNameType {
  firstName: string;
  lastName: string;
  name?: string;
}

export const getFullName = (user: FullNameType) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.name) {
    return user.name;
  }
  return "Invalid name";
};

export type DateType = "date" | "time";

export const getFormattedTime = (dt = new Date()) => {
  const d = new Date(dt).toLocaleString().split(" ");
  const t = d[1].slice(0, -3);
  const time = t + " " + d[2];
  return time;
};

export const getDate = (date: Date = new Date()): Date => {
  if (date) {
    return new Date(date);
  }
  return new Date();
};

export const getNameId = (user: UserModal): NameIdInterface => {
  if (!user._id) {
    return {} as NameIdInterface;
  }
  return { name: getFullName(user), id: user._id };
};

export const getFormattedDate = (dt: Date, format?: string) => {
  const date = new Date(dt);
  const year = date.getFullYear();
  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : "0" + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  switch (format) {
    case "dd-mm-yyyy": {
      return `${day}-${month}-${year}`;
    }
    case "mm-dd-yyyy": {
      return `${month}-${day}-${year}`;
    }
    default: {
      return `${year}-${month}-${day}`;
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

export const getRoomId = (id1: string, id2: string) => {
  if (id1 > id2) {
    return id1 + "-" + id2;
  } else {
    return id2 + "-" + id1;
  }
};

export const getImage = async (path: string) => {
  try {
    const response = await fetch(`${BE_URL}${path}`, {
      headers: {
        Authorization: TOKEN(),
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Get the image blob and create a URL for it
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const ProfileImage = ({
  filename,
  className,
}: {
  filename: string;
  className?: string;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const { alertModal } = useUserContext() as UserContext;
  useEffect(() => {
    if (!filename) return;
    getImage(`/profile-images/${filename}`)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((err) => {
        alertModal({
          severity: Severity.ERROR,
          content: err.message,
          title: "Profile Image",
        });
      });
  }, []);
  return <img src={imageUrl} className={className} />;
};

export const handleValidate = (name: string, value: string): boolean => {
  let isValidField = true;
  if (name === "firstName" || name === "lastName" || name === "designation") {
    isValidField =
      /^[A-Za-z]+\s{0,1}[A-Za-z]*$/.test(value) && value.length >= 3;
  } else if (name === "email") {
    isValidField = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  } else if (name === "mobile") {
    isValidField = /^\+[0-9]{1,2}\s\d{10}$/.test(value);
  } else if (name === "password") {
    isValidField = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/.test(value);
  }
  return isValidField;
};
