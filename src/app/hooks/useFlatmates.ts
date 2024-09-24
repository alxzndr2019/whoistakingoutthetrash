import { useState, useEffect, useCallback } from "react";
import { Flatmate } from "../types";
import { parseISO } from "date-fns";

export const useFlatmates = () => {
  const [flatmates, setFlatmates] = useState<Flatmate[]>([]);

  useEffect(() => {
    const storedFlatmates = localStorage.getItem("flatmates");
    if (storedFlatmates) {
      const parsedFlatmates = JSON.parse(storedFlatmates).map(
        (flatmate: Flatmate) => ({
          ...flatmate,
          lastCleanedDate: flatmate.lastCleanedDate
            ? parseISO(flatmate.lastCleanedDate)
            : null,
          busyUntil: flatmate.busyUntil ? parseISO(flatmate.busyUntil) : null,
        })
      );
      setFlatmates(parsedFlatmates);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flatmates", JSON.stringify(flatmates));
  }, [flatmates]);

  const addFlatmate = useCallback((identifier: string) => {
    setFlatmates((prevFlatmates) => [
      ...prevFlatmates,
      {
        id: Date.now().toString(),
        identifier,
        isBusy: false,
        streak: 0,
        lastCleanedDate: null,
        busyUntil: null,
      },
    ]);
  }, []);

  const removeFlatmate = useCallback((id: string) => {
    setFlatmates((prevFlatmates) => prevFlatmates.filter((f) => f.id !== id));
  }, []);

  const toggleBusy = useCallback((id: string) => {
    setFlatmates((prevFlatmates) =>
      prevFlatmates.map((f) => {
        if (f.id === id) {
          if (f.isBusy) {
            return { ...f, isBusy: false, busyUntil: null };
          } else {
            const busyUntil = new Date();
            busyUntil.setDate(busyUntil.getDate() + 7);
            return { ...f, isBusy: true, busyUntil };
          }
        }
        return f;
      })
    );
  }, []);

  const confirmCleaning = useCallback((id: string) => {
    setFlatmates((prevFlatmates) =>
      prevFlatmates.map((f) =>
        f.id === id
          ? { ...f, streak: f.streak + 1, lastCleanedDate: new Date() }
          : f
      )
    );
  }, []);

  return {
    flatmates,
    addFlatmate,
    removeFlatmate,
    toggleBusy,
    confirmCleaning,
  };
};
