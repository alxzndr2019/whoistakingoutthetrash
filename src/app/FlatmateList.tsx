import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, UserMinus } from "lucide-react";
import { Flatmate } from "./types";
import { format } from "date-fns";

interface FlatmateListProps {
  flatmates: Flatmate[];
  onToggleBusy: (id: string) => void;
  onConfirmCleaning: (id: string) => void;
  onRemove: (id: string) => void;
}

const FlatmateList: React.FC<FlatmateListProps> = ({
  flatmates,
  onToggleBusy,
  onConfirmCleaning,
  onRemove,
}) => {
  return (
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
              onCheckedChange={() => onToggleBusy(flatmate.id)}
            />
            <Label htmlFor={`busy-${flatmate.id}`}>Busy</Label>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onConfirmCleaning(flatmate.id)}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onRemove(flatmate.id)}
            >
              <UserMinus className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FlatmateList;
