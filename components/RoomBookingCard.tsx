// components/RoomBookingCard.tsx
'use client';

import { FC, useEffect, useState } from "react";
import RoomList from "./RoomList";
import Notification from "./Notification";
import BookingForm from "./BookingForm";

const RoomBookingCard: FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data);
    }
    fetchRooms();
  }, []);
  
  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room);
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
        <BookingForm room={selectedRoom} onConfirm={() => {}} />
      ) : (
        <RoomList
          rooms={rooms}
          onSelectRoom={handleRoomSelect}
        />
      )}
    </div>
  );
};

export default RoomBookingCard;