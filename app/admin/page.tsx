"use client";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { VisitorsTab } from "@/components/admin/VisitorsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { RevenueTab } from "@/components/admin/RevenueTab";
import { AdsTab } from "@/components/admin/AdsTab";
import { EventsTab } from "@/components/admin/EventsTab";
import { SettingsTab } from "@/components/admin/SettingsTab";

type AdminTab = "overview" | "visitors" | "users" | "revenue" | "ads" | "events" | "settings";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const tabContent: Record<AdminTab, React.ReactNode> = {
    overview: <OverviewTab />,
    visitors: <VisitorsTab />,
    users: <UsersTab />,
    revenue: <RevenueTab />,
    ads: <AdsTab />,
    events: <EventsTab />,
    settings: <SettingsTab />,
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {tabContent[activeTab]}
    </AdminLayout>
  );
}
