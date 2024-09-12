// components/Notification.tsx
'use client';

import { FC } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: FC<NotificationProps> = ({ message, onClose }) => {
  return (
    <Alert variant="default">
      <AlertTitle>Notification</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
      <Button onClick={onClose} variant="outline">
        Close
      </Button>
    </Alert>
  );
};

export default Notification;