import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

const PinDialog: React.FC<PinDialogProps> = ({ isOpen, onClose, onVerify }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleVerify = () => {
    // In a real app, you'd verify this against a stored value
    if (pin === "1234") {
      onVerify();
      setPin("");
      setError("");
    } else {
      setError("Incorrect PIN. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Flat PIN</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pin" className="text-right">
              PIN
            </Label>
            <Input
              id="pin"
              type="password"
              className="col-span-3"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <Button onClick={handleVerify}>Verify</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PinDialog;
