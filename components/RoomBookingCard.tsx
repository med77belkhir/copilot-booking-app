// components/RoomBookingCard.tsx
"use client";

import { FC, useEffect, useState } from "react";
import RoomList from "./RoomList";
import Notification from "./Notification";
import BookingForm from "./BookingForm";
import { useRoomBooking } from "@/lib/hooks/use-room-booking";

const RoomBookingCard: FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [rooms, setRooms] = useState([]);
  const { addBooking } = useRoomBooking();

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      setRooms(data);
    }
    fetchRooms();
  }, []);

  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
  };

  const handleBookingConfirm = async (
    sdate: string,
    time: string,
    edate: string,
    email: string
  ) => {
    try {
      if (selectedRoom) {
        await addBooking(selectedRoom, sdate, time, edate, email);
        setNotification("Booking confirmed!");
        setSelectedRoom(null);
      }
    } catch (error) {
      setNotification(error.message);
    }
  };

  return (
    <div>
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      {selectedRoom ? (
        <BookingForm room={selectedRoom} onConfirm={handleBookingConfirm} />
      ) : (
        <RoomList rooms={rooms} onSelectRoom={handleRoomSelect} />
      )}
    </div>
  );
};

export default RoomBookingCard;