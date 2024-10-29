import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { room, start, end, time, email } = await request.json();

  try {
    const [startDate] = start.split("T");
    const startDateTime = new Date(`${startDate}T${time}:00`);
    const formattedStart = startDateTime.toISOString();

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);
    const formattedEnd = endDateTime.toISOString();

    // Step 1: Create event-type
    const eventTypePayload = {
      length: 60,
      slug: `booking-${Date.now()}-${room.toLowerCase().replace(/\s+/g, "-")}`,
      title: `Booking for ${room}`,
      description: `Booking for ${room} from ${formattedStart} to ${formattedEnd}`,
      locations: [{ type: "inPerson", address: room }],
      disableGuests: false,
      slotInterval: 0,
      minimumBookingNotice: 0,
      beforeEventBuffer: 0,
      afterEventBuffer: 0,
    };

    const eventTypeResponse = await axios.post(
      `${CALCOM_API_BASE_URL}/event-types`,
      eventTypePayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALCOM_API_KEY}`,
        },
      }
    );

    const eventTypeId = eventTypeResponse.data.data.id;

    // Step 2: Create booking
    const bookingPayload = {
      end: formattedEnd,
      start: formattedStart,
      eventTypeId,
      eventTypeSlug: eventTypePayload.slug,
      timeZone: "Africa/Lagos",
      user: [email],
      language: "en",
      bookingUid: `booking-${Date.now()}`,
      metadata: {},
      responses: {
        name: email.split("@")[0],
        email,
        guests: [],
        notes: `Booking for ${room} from ${formattedStart} to ${formattedEnd}`,
      },
    };

    const bookingResponse = await axios.post(
      `${process.env.CALCOM_API_BASE_URL}/bookings`,
      bookingPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALCOM_API_KEY}`,
        },
      }
    );

    return NextResponse.json(
      { booking: bookingResponse.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error response status:", error.response?.status);
    return NextResponse.json(
      {
        error: "Failed to create booking",
        details: error.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
