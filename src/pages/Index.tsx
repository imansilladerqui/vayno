import { Button } from "@/components/ui/button";
import { Car, BarChart3, Shield, LogIn, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { BackgroundEffects } from "@/components/ui/background-effects";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundEffects particleCount={50} />

      <nav className="relative z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Vayno</span>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 border border-white/20"
            onClick={() => navigate("/login")}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div
          className={`flex flex-col items-center text-center max-w-6xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 hover:bg-white/20 transition-all duration-300">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              New Parking Management Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            The Future of
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Parking Management
            </span>
          </h1>

          <p className="text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed font-light">
            Streamline your parking operations with real-time monitoring,
            automated payments, and comprehensive analytics. Take complete
            control of your parking business.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                Real-Time
              </div>
              <div className="text-gray-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Secure</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Real-Time Monitoring
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Monitor every parking spot in real-time with instant updates,
              occupancy tracking, and automated alerts for maximum efficiency.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Revenue Analytics
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Track daily, weekly, and monthly revenue with comprehensive
              analytics, payment processing, and detailed financial reporting.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/50 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/20">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">
              Secure Management
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Robust security with role-based access control, secure payment
              processing, and comprehensive user management for your parking
              business.
            </p>
          </div>
        </div>

        <div className="mt-32 text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Parking Business?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto px-4">
              Be among the first to experience the next generation of parking
              management. Start your journey with Vayno today.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/signup")}
            >
              <LogIn className="mr-2 h-5 w-5" />
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
