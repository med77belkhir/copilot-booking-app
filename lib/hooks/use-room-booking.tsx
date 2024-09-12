// lib/hooks/use-room-booking.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { Booking, BookingStatus } from "@/lib/booking.types";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";

interface RoomBookingContextType {
  bookings: Booking[];
  addBooking: (
    room: string,
    start: string,
    time: string,
    end: string,
    email: string
  ) => Promise<void>;
  cancelBooking: (room: string, date: string, reason: string) => Promise<void>;
  setBookingStatus: (id: number, status: BookingStatus) => void;
}

const RoomBookingContext = createContext<RoomBookingContextType | undefined>(
  undefined
);

export function RoomBookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState([]);

  const addBooking = async (
    room: string,
    start: string,
    time: string,
    end: string,
    email: string
  ) => {
    try {
      const response = await axios.post(`/api/bookings`, {
        room,
        start,
        time,
        end,
        email,
      });

      setBookings([...bookings, response.data]);
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  const cancelBooking = async (room: string, date: string, reason: string) => {
    try {
      const bookingToCancel = bookings.find(
        (booking) => booking.room === room && booking.start.startsWith(date)
      );

      if (!bookingToCancel) {
        throw new Error("Booking not found");
      }

      const cancelPayload = {
        id: bookingToCancel.id,
        uid: bookingToCancel.uuid,
        allRemainingBookings: true,
        cancellationReason: reason,
      };

      await axios.post(`/api/cancel`, cancelPayload);
      setBookings(
        bookings.filter((booking) => booking.id !== bookingToCancel.id)
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  const setBookingStatus = (id: number, status: BookingStatus) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const fetchAvailableRooms = async (date: string) => {
    const response = await axios.get(`/api/rooms?date=${date}`);
    return response.data;
  };

  useCopilotReadable({
    description: "The state of the booking list",
    value: JSON.stringify(bookings),
  });

  useCopilotReadable({
    description: "The state of the rooms list",
    value: JSON.stringify(rooms),
  });

  useCopilotAction({
    name: "addBooking",
    description: "Adds a booking to the list",
    parameters: [
      {
        name: "room",
        type: "string",
        description: "The room to be booked",
        required: true,
      },
      {
        name: "date",
        type: "string",
        description: "The date of the booking",
        required: true,
      },
      {
        name: "time",
        type: "string",
        description: "The time of the booking",
        required: true,
      },
      {
        name: "end",
        type: "string",
        description: "The checkout time for booking",
        required: true,
      },
      {
        name: "email",
        type: "string",
        description: "Email address of the user booking the room",
        required: true,
      },
    ],
    handler: async ({ room, date, time, end, email }) => {
      await addBooking(room, date, time, end, email);
    },
  });

  useCopilotAction({
    name: "cancelBooking",
    description: "Cancels a booking from the list",
    parameters: [
      {
        name: "room",
        type: "string",
        description: "The room of the booking to be cancelled",
        required: true,
      },
      {
        name: "date",
        type: "string",
        description: "The date of the booking to be cancelled",
        required: true,
      },
      {
        name: "reason",
        type: "string",
        description: "The reason for cancellation",
        required: true,
      },
    ],
    handler: async ({ room, date, reason }) => {
      await cancelBooking(room, date, reason);
    },
  });

  useCopilotAction({
    name: "fetchAvailableRooms",
    description: "Fetches available rooms for a given date",
    parameters: [
      {
        name: "date",
        type: "string",
        description: "The date to check room availability",
        required: true,
      },
    ],
    handler: async ({ date }) => {
      const availableRooms = await fetchAvailableRooms(date);
      setRooms(availableRooms);
    },
  });

  useCopilotAction({
    name: "setBookingStatus",
    description: "Sets the status of a booking",
    parameters: [
      {
        name: "id",
        type: "number",
        description: "The ID of the booking",
        required: true,
      },
      {
        name: "status",
        type: "string",
        description: "The status of the booking",
        enum: Object.values(BookingStatus),
        required: true,
      },
    ],
    handler: ({ id, status }) => {
      setBookingStatus(id, status);
    },
  });

  return (
    <RoomBookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        setBookingStatus,
      }}
    >
      {children}
    </RoomBookingContext.Provider>
  );
}

export function useRoomBooking() {
  const context = useContext(RoomBookingContext);
  if (context === undefined) {
    throw new Error("useRoomBooking must be used within a RoomBookingProvider");
  }
  return context;
}
