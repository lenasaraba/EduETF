import { createContext, useContext } from "react";

interface BrandingContextType {
  branding: any; 
  setBranding: (branding: any) => void;
}

export const BrandingContext = createContext<BrandingContextType | undefined>(
  undefined
);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within BrandingProvider");
  }
  return context;
};
