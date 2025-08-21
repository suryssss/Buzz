import "./globals.css";
import ConvexClientProvider from "../providers/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "../components/ui/theme/theme-provider";
import { Toaster} from "../components/ui/sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors/>
            </ConvexClientProvider>
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
