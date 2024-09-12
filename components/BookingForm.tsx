// components/BookingForm.tsx

'use client';

import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface BookingFormProps {
    room: string;
    onConfirm: (
      edate: string,
      time: string,
      sdata: string,
      email: string
    ) => void;
  }
  
  const BookingForm: FC<BookingFormProps> = ({ room, onConfirm }) => {
    const [sdate, setSdate] = useState("");
    const [edate, setEdate] = useState("");
    const [time, setTime] = useState("");
    const [email, setEmail] = useState("");
  
    const handleConfirm = () => {
      if (sdate && time && edate && email) {
        console.log(email)
        onConfirm(edate, time, sdate, email);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Room: {room}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="start_date">Check In Date</Label>
              <Input
                id="sdate"
                type="date"
                value={sdate}
                onChange={(e) => setSdate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="end_date">Checkout Date</Label>
              <Input
                id="edate"
                type="date"
                value={edate}
                onChange={(e) => setEdate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConfirm} variant="secondary">
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  export default BookingForm;