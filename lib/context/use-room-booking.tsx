// lib/hooks/use-room-booking.tsx

import { createContext, useContext, useState, ReactNode } from "react";
import axios from "axios";
import { Booking, BookingStatus } from "@/lib/booking.types";

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