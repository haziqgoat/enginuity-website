import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendar | Staff Panel",
  description: "Manage your schedule and appointments",
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}