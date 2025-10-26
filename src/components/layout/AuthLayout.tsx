import { ReactNode } from "react";
import { Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import { BackgroundEffects } from "@/components/ui/background-effects";

interface AuthLayoutProps {
  children: ReactNode;
  backNavigation?: () => void;
}

const Header = ({ onBack }: { onBack?: () => void }) => {
  const navigate = useNavigate();
  const handleBack = onBack || (() => navigate(-1));

  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-white hover:bg-white/10 h-10 w-10 p-0 -ml-16"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="inline-flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-bold text-white">Vayno</span>
        </div>
      </div>
    </div>
  );
};

export const AuthLayout = ({ children, backNavigation }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      <BackgroundEffects particleCount={30} />

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        <Header onBack={backNavigation} />
        {children}
      </div>
    </div>
  );
};
