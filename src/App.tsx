import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/providers/DialogProvider";
import { AppRoutes } from "@/routes";
import { queryClient } from "@/lib/queryClient";
import { DialogManager } from "@/components/dialogs/DialogManager";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DialogProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <DialogManager />
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </DialogProvider>
  </QueryClientProvider>
);

export default App;
