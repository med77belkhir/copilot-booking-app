// components/RoomList.tsx
"use client";

import { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Room } from "@/lib/room.types";
import { Label } from "@radix-ui/react-label";

interface RoomListProps {
  rooms: Room[];
  onSelectRoom: (room: string) => void;
}

const RoomList: FC<RoomListProps> = ({ rooms, onSelectRoom }) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {rooms ? (
        rooms.map((room) => (
          <Card key={room.name}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardContent>
                Room Amenities:
                {room.amenities.map((amenity) => (
                  <span style={{marginLeft:10}} key={amenity}>{amenity},</span>
                ))}
              </CardContent>{" "}
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => onSelectRoom(room.name)}
                variant="secondary"
              >
                Select Room
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Label>No rooms available</Label>
      )}
    </div>
  );
};

export default RoomList;
