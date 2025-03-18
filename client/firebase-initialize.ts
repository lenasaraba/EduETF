import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { sendTokenToBackend } from "./src/features/account/accountSlice";

const firebaseConfig = {
  apiKey: "AIzaSyB4SzYhlLozSjJyZ98lAjaJ1h5PFMaQWpc",
  authDomain: "eduetf-95ea5.firebaseapp.com",
  projectId: "eduetf-95ea5",
  storageBucket: "eduetf-95ea5.firebasestorage.app",
  messagingSenderId: "501055750353",
  appId: "1:501055750353:web:830661f3e389c81707c5f0",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = (userId: number, dispatch: any) => {
  return getToken(messaging, {
    vapidKey:
      "BFC8htox7MXIYx-y2qsgxWAV5xSVFuKcLcJQORjx77-GW2SGqS3ppgRRd6FAVxPZnyWWQQfjsWlleP3DXAIOASQ",
  })
    .then((currentToken) => {
      if (currentToken) {
        dispatch(sendTokenToBackend({ userId: userId, token: currentToken }));
      } 
    })
    .catch((err) => {
      console.log("Error pri pribavljanju tokena. ", err);
    });
};

onMessage(messaging, (payload) => {
  toast(`🎓${payload.notification?.body}`, {
    autoClose: 5000,
    style: {
      backgroundColor: "#A59D84",
      color: "#2C3639",
      fontFamily: "Raleway, sans-serif",
      padding: "15px",
      border: "1px solid #2C3639",
      borderRadius: "10pt",
    },
  });
});
