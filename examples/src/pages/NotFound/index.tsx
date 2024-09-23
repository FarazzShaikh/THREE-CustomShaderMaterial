import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  useLayoutEffect(() => {
    navigate("/", { replace: true });
  }, []);

  return null!;
}
