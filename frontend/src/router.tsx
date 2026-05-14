import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import AnalysisPage from "@/pages/AnalysisPage";
import FileUploadPage from "@/pages/FileUploadPage";
import { useFileStore } from "@/stores/use-file-store";

function ProtectedRoute() {
  const hasFiles = useFileStore((s) => s.files.length > 0);
  if (!hasFiles) return <Navigate to="/upload" replace />;
  return <Outlet />;
}

const routes = [
  {
    path: "/",
    element: <Navigate to="/upload" replace />,
  },
  {
    path: "/upload",
    element: <FileUploadPage />,
  },
  {
    path: "/analysis",
    element: <ProtectedRoute />,
    children: [{ index: true, element: <AnalysisPage /> }],
  },
];

export const router = createBrowserRouter(routes);
