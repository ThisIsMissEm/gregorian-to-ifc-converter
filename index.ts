const gregorianFixedMonths = [
  31, // January
  28, // February
  31, // March
  30, // April
  31, // May
  30, // June
  31, // July
  31, // August
  30, // September
  31, // October
  30, // November
  31 // December
];

const ifcMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "Sol",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const ifcShortMonthNames = ifcMonthNames.map(name => name.substring(0, 3));

const dayNames = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

const shortDayNames = dayNames.map(name => name.substring(0, 3));

export function getIsLeapYear(year: number) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function getDayOfYear(date: Date) {
  const isLeapYear = getIsLeapYear(date.getUTCFullYear());
  const month = date.getUTCMonth();
  const dateOfMonth = date.getUTCDate();

  const dayOfYear = gregorianFixedMonths.reduce((acc, daysInMonth, offset) => {
    // Past current month, but Reduce doesn't break
    // Not really a performance issue as we'd at maximum save 11 iterations, and this is fast-enough
    if (offset > month) return acc;
    // Current month:
    if (offset == month) return acc + dateOfMonth;
    // February
    if (offset == 1) return acc + (isLeapYear ? 29 : 28);
    // Rest:
    return acc + daysInMonth;
  }, 0);

  return dayOfYear;
}

export function toIFCString(date: Date, useProposed = false) {
  const year = date.getUTCFullYear();
  const isLeapYear = getIsLeapYear(year);

  let dayOfYear = getDayOfYear(date);
  let month = Math.floor((dayOfYear - 1) / 28);
  let dayOfMonth = dayOfYear % 28 == 0 ? 28 : dayOfYear % 28;

  if (isLeapYear && !useProposed) {
    if (month === 6 && dayOfMonth === 1) {
      return `Leap Day ${year}`;
    }

    if (month >= 6) {
      dayOfYear = dayOfYear - 1;
      month = Math.floor((dayOfYear - 1) / 28);
      dayOfMonth = dayOfYear % 28 == 0 ? 28 : dayOfYear % 28;
    }
  }

  if (month === 13) {
    if (dayOfMonth == 1) {
      return `New Years Day ${year + 1}`;
    }

    // This is when using the proposed calendar; In the original Interational Fixed
    // Calendar the Leap Day is inserted Between 28th Jun and 1st Sol.
    if (dayOfMonth == 2) {
      return `Leap Day ${year + 1}`;
    }
  }

  const paddedDayOfMonth = dayOfMonth.toString().padStart(2, "0");
  const dayName = shortDayNames[dayOfMonth % 7];

  return `${dayName}, ${paddedDayOfMonth} ${ifcShortMonthNames[month]} ${year}`;
}

if (require.main === module) {
  const output = [
    // Non-Leap Year, 1999
    new Date("Fri, 31 Dec 1999 00:01:01 GMT"),
    // Leap Year, 2000
    new Date("Fri, 1 Jan 2000 00:01:01 GMT"),
    new Date("Thu, 20 Jan 2000 00:01:01 GMT"),
    new Date("Thu, 28 Jan 2000 00:01:01 GMT"),
    new Date("Thu, 29 Jan 2000 00:01:01 GMT"),
    new Date("Tue, 25 Feb 2000 00:01:01 GMT"),
    new Date("Tue, 29 Feb 2000 00:01:01 GMT"),
    new Date("Sat, 16 Jun 2000 23:01:01 GMT"), // 28 June 2000
    new Date("Sat, 17 Jun 2000 23:01:01 GMT"), // Leap Day 2000
    new Date("Sat, 18 Jun 2000 23:01:01 GMT"), // 1 Sol 2000
    new Date("Sat, 15 Jul 2000 23:01:01 GMT"), // 28 Sol 2000
    new Date("Sat, 16 Jul 2000 23:01:01 GMT"), // 1 July 2000
    new Date("Sat, 12 Aug 2000 23:01:01 GMT"), // 28 July 2000
    new Date("Wed, 20 Dec 2000 00:01:01 GMT"),
    new Date("Thu, 29 Dec 2000 00:01:01 GMT"), // 27 December
    new Date("Thu, 30 Dec 2000 00:01:01 GMT"), //
    new Date("Thu, 31 Dec 2000 00:01:01 GMT"),
    // Non-leap Year:
    new Date("Fri, 1 Jan 2001 00:01:01 GMT"),
    new Date("Thu, 20 Jan 2001 00:01:01 GMT"),
    new Date("Thu, 28 Jan 2001 00:01:01 GMT"),
    new Date("Thu, 29 Jan 2001 00:01:01 GMT"),
    new Date("Tue, 25 Feb 2001 00:01:01 GMT"),
    new Date("Tue, 29 Feb 2001 00:01:01 GMT"),
    new Date("Sat, 16 Jun 2001 23:01:01 GMT"), // 28 June 2001
    new Date("Sat, 17 Jun 2001 23:01:01 GMT"), // 1 Sol 2001
    new Date("Sat, 18 Jun 2001 23:01:01 GMT"), // 1 Sol 2001
    new Date("Sat, 15 Jul 2001 23:01:01 GMT"), // 28 Sol 2001
    new Date("Sat, 16 Jul 2001 23:01:01 GMT"), // 1 July 2001
    new Date("Sat, 12 Aug 2001 23:01:01 GMT"), // 28 July 2001
    new Date("Wed, 20 Dec 2001 00:01:01 GMT"),
    new Date("Thu, 29 Dec 2001 00:01:01 GMT"), // 27 December
    new Date("Thu, 30 Dec 2001 00:01:01 GMT"), //
    new Date("Thu, 31 Dec 2001 00:01:01 GMT"),
    // Today
    new Date()
  ].reduce(
    (acc, date, idx, input) => {
      if (idx - 1 >= 0 && input[idx - 1].getFullYear() !== date.getFullYear()) {
        acc.utcToIfc.push("");
        acc.utcToIfcp.push("");
      }
      let utc = date.toUTCString().slice(0, 16);
      let itc = toIFCString(date).padEnd(18);
      let itcp = toIFCString(date, true).padEnd(18);

      acc.utcToIfc.push(`${utc} => ${itc}`);
      acc.utcToIfcp.push(`${utc} => ${itcp}`);

      return acc;
    },
    { utcToIfc: [], utcToIfcp: [] }
  );

  console.log("\nUTC Gregorian to International Fixed Calendar:\n");
  output.utcToIfc.forEach(conversion => console.log(conversion));

  console.log("\nUTC Gregorian to Proposed Calendar:\n");
  output.utcToIfcp.forEach(conversion => console.log(conversion));
}
