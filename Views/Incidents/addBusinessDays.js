export default function addBusinessDays(numDays, argDate) {
/** Set the modified date with moment; */
const momentModified = argDate? moment(argDate) : moment();

/** Set the due date to three days from the modified date; */
let DUEDATE = momentModified.add(numDays, 'days');

/** Handle the due date for weekends; */
let dayOfTheWeek = DUEDATE.day();

/** Handle Sundays; */
if (dayOfTheWeek === 0) DUEDATE.add(1, 'days');

/** Handle Saturdays; */
if (dayOfTheWeek === 6) DUEDATE.add(2, 'days');

return DUEDATE
}