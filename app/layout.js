"use client";

import { DidProvider } from "./contexts/DidContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import "./globals.css";
import Providers from "./providers/provider";
import { BrowserRouter } from "react-router-dom";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <BrowserRouter>
        <Providers>
          <ProfileProvider>
            <DidProvider>
              {children}
            </DidProvider>
          </ProfileProvider>
        </Providers>
      </BrowserRouter>
    </html>
  );
}