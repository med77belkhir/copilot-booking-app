// app/page.tsx

import Layout from "@/components/Layout";
import RoomBookingCard from "@/components/RoomBookingCard";

export default function Home() {
  return (
    <Layout>
      <RoomBookingCard />
    </Layout>
  );
}