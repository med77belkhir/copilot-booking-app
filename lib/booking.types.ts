// app/lib/booking.types.ts
export interface Booking {
  start: any;
  uuid: string;
  id: number;
  room: string;
  date: string;
  time: string;
}


export enum BookingStatus {
  booking = "booking",
  booked = "booked",
}