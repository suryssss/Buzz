import "./globals.css";
import ConvexClientProvider from "../providers/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
            </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
