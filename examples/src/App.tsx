import "./styles/index.css";

import { RouterProvider, createHashRouter } from "react-router-dom";
import { SHADERS } from "./Examples";
import { NotFound } from "./pages/NotFound";
import { Root } from "./pages/Root";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      ...Object.values(SHADERS).map((preset) => ({
        path: preset.slug,
        element: <preset.Component />,
      })),
      {
        path: "/",
        element: <SHADERS.DEFAULT.Component />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
