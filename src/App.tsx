import { useState } from "react";
import { Segment } from "@heroui-pro/react";
import { VlootschouwPage } from "./pages/VlootschouwPage";
import { TEAM_MANAGER_NAME } from "./data/vlootschouw";

type Role = "admin" | "manager";

export default function App() {
  const [role, setRole] = useState<Role>(() => (new URLSearchParams(location.search).get("role") === "manager" ? "manager" : "admin"));
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <nav className="border-border bg-surface flex items-center justify-between border-b px-10 py-3">
        <span className="text-sm font-semibold">Welder · prototype</span>
        <div className="flex items-center gap-3">
          <span className="text-muted text-xs">Ingelogd als {role === "admin" ? "HR / admin" : TEAM_MANAGER_NAME}</span>
          <Segment size="sm" selectedKey={role} onSelectionChange={(k) => setRole(k as Role)} aria-label="Rol">
            <Segment.Item id="admin">Admin (HR)</Segment.Item>
            <Segment.Item id="manager">Leidinggevende</Segment.Item>
          </Segment>
        </div>
      </nav>
      <main className="mx-auto max-w-[1440px] px-10 py-10">
        <VlootschouwPage key={role} role={role} />
      </main>
    </div>
  );
}
