import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/wiedza")({
  component: KnowledgeLayout,
});

function KnowledgeLayout() {
  return <Outlet />;
}
