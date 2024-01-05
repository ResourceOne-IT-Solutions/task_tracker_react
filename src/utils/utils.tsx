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
