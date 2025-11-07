import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/providers/DialogProvider";
import { ModalProvider } from "@/providers/ModalProvider";
import { DrawerProvider } from "@/providers/DrawerProvider";
import { AppRoutes } from "@/routes";
import { queryClient } from "@/lib/queryClient";
import { DialogManager } from "@/components/dialogs/DialogManager";
import { ModalManager } from "@/components/modals/ModalManager";
import { DrawerManager } from "@/components/drawers/DrawerManager";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DialogProvider>
      <ModalProvider>
        <DrawerProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <DialogManager />
                <ModalManager />
                <DrawerManager />
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </DrawerProvider>
      </ModalProvider>
    </DialogProvider>
  </QueryClientProvider>
);

export default App;
