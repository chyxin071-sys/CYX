import { createBrowserRouter } from "react-router";
import { HomePage } from "./pages/home-page";
import { RecordPage } from "./pages/record-page";
import { MapPage } from "./pages/map-page";
import { SummaryPage } from "./pages/summary-page";
import { SettingsPage } from "./pages/settings-page";
import { ExportPage } from "./pages/export-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/record/:date?",
    Component: RecordPage,
  },
  {
    path: "/map",
    Component: MapPage,
  },
  {
    path: "/summary",
    Component: SummaryPage,
  },
  {
    path: "/export/:format",
    Component: ExportPage,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
]);