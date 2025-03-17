import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../../../authConfig";
import { useAccessToken } from "../useAccessToken";

export const LoginButton: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = useAccessToken();

  useEffect(() => {
    if (accounts.length > 0) {
      setIsLoggedIn(true); // Ako je korisnik prijavljen, postavi stanje
    }
  }, [accounts]); // Prati promene u nalogu

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Greška pri prijavi:", error);
    });
  };

  const fetchProtectedData = async () => {
    if (!token) {
      console.error("Nema access tokena!");
      return;
    }

    try {
      const response = await fetch("https://localhost:5001/api/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Greška pri pozivanju API-ja");
      }

      const data = await response.json();
      console.log("Dobijeni podaci:", data);
    } catch (error) {
      console.error("Greška:", error);
    }
  };

  // Ako je korisnik prijavljen, pozovi API
  useEffect(() => {
    if (isLoggedIn && token) {
      fetchProtectedData();
    }
  }, [isLoggedIn, token]); // Ova funkcija će se pozvati kada je korisnik prijavljen i token dostupan

  return (
    <div>
      {!isLoggedIn ? (
        <button
          onClick={handleLogin}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Prijavi se LENOOOO
        </button>
      ) : (
        <p>Ulogovani ste</p>
      )}
    </div>
  );
};
