import { useContext } from "react";
import { LenisContext } from "@/context/LenisContext";

export function useLenis() {
  return useContext(LenisContext);
}
