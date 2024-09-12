import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET() {
  try {
    // Get the path of the json file
    const jsonDirectory = path.join(process.cwd(), "data");
    // Read the json file
    const fileContents = await fs.readFile(
      jsonDirectory + "/rooms.json",
      "utf8"
    );
    // Parse the JSON string
    const rooms = JSON.parse(fileContents);

    // If you want to return only available rooms, you can do:
    const availableRooms = rooms.rooms.filter(
      (room: { status: string }) => room.status === "available"
    );
    return NextResponse.json(availableRooms);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch rooms data" },
      { status: 500 }
    );
  }
}
