import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";  
import { InteractionRequiredAuthError } from "@azure/msal-browser";


 // Dozvole koje aplikacija zahteva

 export const useAccessToken = (): string | null => {
  const { accounts, instance } = useMsal();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (accounts.length === 0) return; // Nema korisnika prijavljenih

      const request = {
        scopes: ["User.Read"], // Scope backend API-ja
        account: accounts[0],
      };

      try {
        const response = await instance.acquireTokenSilent(request);
        setAccessToken(response.accessToken);
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          try {
            const response = await instance.acquireTokenPopup(request);
            setAccessToken(response.accessToken);
          } catch (popupError) {
            console.error("Greška pri dobijanju tokena (popup):", popupError);
            setAccessToken(null);
          }
        } else {
          console.error("Greška pri dobijanju tokena:", error);
          setAccessToken(null);
        }
      }
    };

    fetchToken();
  }, [accounts, instance]);

  return accessToken;
};