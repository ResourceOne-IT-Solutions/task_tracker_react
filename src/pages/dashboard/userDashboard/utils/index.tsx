// export const BreakTimings = () => {
//   return <></>;
// };

export const getBreakTimings = (duration: number) => {
  const addZero = (num: number) => {
    return num >= 10 ? num : `0${num}`;
  };
  const sec = Math.round(duration % 60);
  let min = Math.round(duration / 60);
  const hrs = Math.floor(min / 60);
  if (hrs > 0) {
    min = min % 60;
    return `${addZero(hrs)}:${addZero(min)}:${addZero(sec)}`;
  }
  return `${addZero(min)}: ${addZero(sec)}`;
};
export const calculateLoginHours = (inTime: Date, outTime: Date) => {
  if (!inTime) {
    return "00:00hrs";
  }
  inTime = new Date(inTime);
  if (!outTime) {
    outTime = new Date(inTime);
    outTime.setHours(15);
    outTime.setMinutes(30);
  } else {
    outTime = new Date(outTime);
  }
  const secs = (outTime.getTime() - inTime.getTime()) / 1000;
  return getBreakTimings(secs);
};
