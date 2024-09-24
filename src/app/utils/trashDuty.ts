import { Flatmate } from "../types";
import { addWeeks, isBefore } from "date-fns";

export const getTrashDutyPerson = (
  flatmates: Flatmate[],
  date: Date
): string => {
  const availableFlatmates = flatmates.filter((f) => !f.isBusy);
  if (availableFlatmates.length === 0) return "No available flatmates";

  const sortedFlatmates = [...availableFlatmates].sort((a, b) => {
    if (a.lastCleanedDate && b.lastCleanedDate) {
      return a.lastCleanedDate.getTime() - b.lastCleanedDate.getTime();
    }
    if (a.lastCleanedDate) return 1;
    if (b.lastCleanedDate) return -1;
    return 0;
  });

  return sortedFlatmates[0].identifier;
};

export const getUpcomingDuties = (
  flatmates: Flatmate[],
  startDate: Date,
  weeks: number
): { date: Date; flatmate: string }[] => {
  const duties = [];
  let currentDate = new Date(startDate);
  const endDate = addWeeks(startDate, weeks);

  while (isBefore(currentDate, endDate)) {
    const dutyPerson = getTrashDutyPerson(flatmates, currentDate);
    duties.push({
      date: new Date(currentDate),
      flatmate: dutyPerson,
    });

    // Update the last cleaned date for the selected flatmate
    const selectedFlatmate = flatmates.find((f) => f.identifier === dutyPerson);
    if (selectedFlatmate) {
      selectedFlatmate.lastCleanedDate = new Date(currentDate);
    }

    currentDate = addWeeks(currentDate, 1);
  }

  return duties;
};
