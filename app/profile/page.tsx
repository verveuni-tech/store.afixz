import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your AfixZ Store account, orders, and saved addresses.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
