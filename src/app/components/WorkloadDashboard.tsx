import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Flatmate } from "../types";
import { getUpcomingDuties } from "../utils/trashDuty";
import { format } from "date-fns";

interface WorkloadDashboardProps {
  flatmates: Flatmate[];
}

const WorkloadDashboard: React.FC<WorkloadDashboardProps> = ({ flatmates }) => {
  const upcomingDuties = useMemo(
    () => getUpcomingDuties(flatmates, new Date(), 4),
    [flatmates, flatmates.length] // Add flatmates.length as a dependency
  );

  return (
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
        <h3 className="font-semibold mt-4 mb-2">Cleaning Streaks</h3>
        <ul>
          {flatmates.map((flatmate) => (
            <li key={flatmate.id}>
              {flatmate.identifier}: {flatmate.streak}{" "}
              {flatmate.streak === 1 ? "time" : "times"}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WorkloadDashboard;
