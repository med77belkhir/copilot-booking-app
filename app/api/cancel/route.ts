import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const CALCOM_API_BASE_URL = "https://api.cal.com/v2";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const bookingId = params.id;

    const cancelledBookingResponse = await axios.post(
      `${CALCOM_API_BASE_URL}/bookings/${bookingId}/cancel`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CALCOM_API_KEY}`,
        },
      }
    );

    return NextResponse.json(
      { booking: cancelledBookingResponse.data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
