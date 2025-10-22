import { Button } from "@/components/ui/button";
import { Car, BarChart3, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Revolutionary Parking Management</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Manage Your Parking Lot Like Never Before
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Take complete control of your parking business from anywhere. Monitor occupancy, track revenue, and manage operations without relying on anyone else.
          </p>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-gradient-primary shadow-glow"
              onClick={() => navigate("/dashboard")}
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 w-fit mb-4">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Monitoring</h3>
            <p className="text-muted-foreground">
              Track every spot in real-time. Know exactly what's happening in your parking lot at any moment.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent to-accent/80 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Revenue Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive insights into your daily, weekly, and monthly revenue with beautiful charts.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all">
            <div className="p-3 rounded-xl bg-gradient-to-br from-success to-success/80 w-fit mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Complete Control</h3>
            <p className="text-muted-foreground">
              Manage your business independently without needing to trust or rely on employees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
