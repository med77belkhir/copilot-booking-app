// app/page.tsx
"use client";

import Layout from "@/components/Layout";
import RoomBookingCard from "@/components/RoomBookingCard";
import { RoomBookingProvider } from "@/lib/hooks/use-room-booking";
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

export default function Home() {
  return (
    <CopilotKit publicApiKey={process.env.PUBLIC_API_KEY}>
      <RoomBookingProvider>
        <Layout>
          <RoomBookingCard />
        </Layout>
      </RoomBookingProvider>
      <CopilotPopup />
    </CopilotKit>
  );
}