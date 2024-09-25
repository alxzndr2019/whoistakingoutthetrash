"use client";
import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, UserMinus } from "lucide-react";
import { format, addWeeks, isBefore } from "date-fns";
import {
  addFlatmate,
  toggleBusy,
  deleteFlatmate,
  confirmCleaning,
} from "@/actions/flatmatesActions";

interface Flatmate {
  id: number;

  identifier: string;

  isBusy: boolean;

  streak: number;

  lastCleanedDate: string | null;

  busyUntil: string | null;
}

interface FlatmatesProps {
  flatmates: Flatmate[];
}

const Flatmates: React.FC<FlatmatesProps> = ({ flatmates }) => {
  //   const [date, setDate] = useState<Date>(new Date());
  const [newFlatmate, setNewFlatmate] = useState("");
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pin, setPin] = useState("");
  const [actionToPerform, setActionToPerform] = useState<() => void>(() => {});

  const requirePin = (action: () => void) => {
    setActionToPerform(() => action);
    setShowPinDialog(true);
  };

  const handlePinVerified = () => {
    if (pin === "1234") {
      setShowPinDialog(false);
      actionToPerform();
      setPin("");
    } else {
      alert("Incorrect PIN");
    }
  };

  //   const toggleBusy = async (id: number) => {
  //     const flatmate = flatmates.find((f) => f.id === id);
  //     if (flatmate) {
  //       const busyUntil = flatmate.isBusy ? null : addWeeks(new Date(), 1);
  //       const response = await fetch("/api/flatmates", {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ id, isBusy: !flatmate.isBusy, busyUntil }),
  //       });
  //       const updatedFlatmate = await response.json();
  //       setFlatmates(flatmates.map((f) => (f.id === id ? updatedFlatmate : f)));
  //     }
  //   };

  //   const confirmCleaning = async (id: number) => {
  //     const flatmate = flatmates.find((f) => f.id === id);
  //     if (flatmate) {
  //       const response = await fetch("/api/flatmates", {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           id,
  //           streak: flatmate.streak + 1,
  //           lastCleanedDate: new Date(),
  //         }),
  //       });
  //       const updatedFlatmate = await response.json();
  //       setFlatmates(flatmates.map((f) => (f.id === id ? updatedFlatmate : f)));
  //     }
  //   };

  const getTrashDutyPerson = (flatmates: Flatmate[]): string => {
    const availableFlatmates = flatmates.filter((f) => !f.isBusy);
    if (availableFlatmates.length === 0) return "No available flatmates";

    const sortedFlatmates = [...availableFlatmates].sort((a, b) => {
      if (a.lastCleanedDate && b.lastCleanedDate) {
        return (
          new Date(a.lastCleanedDate).getTime() -
          new Date(b.lastCleanedDate).getTime()
        );
      }
      if (a.lastCleanedDate) return 1;
      if (b.lastCleanedDate) return -1;
      return 0;
    });

    return sortedFlatmates[0].identifier;
  };

  const getUpcomingDuties = (
    flatmates: Flatmate[],
    startDate: Date,
    weeks: number
  ): { date: Date; flatmate: string }[] => {
    const duties = [];
    let currentDate = new Date(startDate);
    const endDate = addWeeks(startDate, weeks);
    const availableFlatmates = flatmates.filter((f) => !f.isBusy);

    if (availableFlatmates.length === 0) {
      return Array(weeks).fill({
        date: new Date(),
        flatmate: "No available flatmates",
      });
    }

    let flatmateIndex = 0;
    while (isBefore(currentDate, endDate)) {
      const selectedFlatmate = availableFlatmates[flatmateIndex];
      duties.push({
        date: new Date(currentDate),
        flatmate: selectedFlatmate.identifier,
      });

      // Move to the next flatmate, wrapping around if we reach the end
      flatmateIndex = (flatmateIndex + 1) % availableFlatmates.length;

      currentDate = addWeeks(currentDate, 1);
    }

    return duties;
  };

  const upcomingDuties = useMemo(
    () => getUpcomingDuties(flatmates, new Date(), 4),
    [flatmates]
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weekly Trash Duty Scheduler</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card> */}
        <Card>
          <CardHeader>
            <CardTitle>This Weeks Trash Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getTrashDutyPerson(flatmates)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Upcoming Duties</h3>
          <ul>
            {upcomingDuties.map((duty, index) => (
              <li key={index}>
                {format(duty.date, "dd/MM/yyyy")}: {duty.flatmate}
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mt-4 mb-2">Trash Streaks</h3>
          <ul>
            {flatmates.map((flatmate) => (
              <li key={flatmate.id}>
                {flatmate.identifier} has taken out the trash {flatmate.streak}{" "}
                {flatmate.streak === 1 ? "time" : "times"}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Manage Flatmates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter flatmate name"
              value={newFlatmate}
              onChange={(e) => setNewFlatmate(e.target.value)}
            />
            <Button onClick={() => requirePin(() => addFlatmate(newFlatmate))}>
              Add Flatmate
            </Button>
          </div>
          <ul className="space-y-2">
            {flatmates.map((flatmate) => (
              <li
                key={flatmate.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <div>
                  <span>{flatmate.identifier}</span>
                  <Badge variant="secondary" className="ml-2">
                    Streak: {flatmate.streak}
                  </Badge>
                  {flatmate.busyUntil && (
                    <Badge variant="outline" className="ml-2">
                      Busy until: {format(flatmate.busyUntil, "dd/MM/yyyy")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={flatmate.isBusy}
                    onCheckedChange={() =>
                      requirePin(() => toggleBusy(flatmate.id))
                    }
                  />
                  <Label htmlFor={`busy-${flatmate.id}`}>Busy</Label>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      requirePin(() => confirmCleaning(flatmate.id))
                    }
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      requirePin(() => deleteFlatmate(flatmate.id))
                    }
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={showPinDialog} onOpenChange={setShowPinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter PIN</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
          <Button onClick={handlePinVerified}>Verify</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Flatmates;
