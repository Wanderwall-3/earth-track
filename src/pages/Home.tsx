import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import heroImage from '@/assets/hero-waste-management.jpg';
import { Recycle, Leaf, Target, Users, TrendingDown, Award } from 'lucide-react';

const Home: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Recycle,
      title: "Smart Waste Tracking",
      description: "Log and categorize your waste to understand your environmental impact"
    },
    {
      icon: TrendingDown,
      title: "Analytics Dashboard",
      description: "Visualize your progress with detailed charts and insights"
    },
    {
      icon: Users,
      title: "Community Challenges",
      description: "Join local challenges and compete with neighbors for sustainability"
    },
    {
      icon: Leaf,
      title: "Educational Resources",
      description: "Learn best practices for waste reduction and composting"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and track personal waste reduction targets"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and rewards for your environmental efforts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Sustainable waste management and environmental conservation"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Hero Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Track. Reduce.
                  <span className="block text-primary-glow animate-pulse-glow">
                    Transform.
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                  Join the community-driven movement to reduce waste footprint through 
                  smart tracking, gamification, and education.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm animate-float">
                  <div className="text-3xl font-bold text-primary-glow">10K+</div>
                  <div className="text-sm text-white/80">Items Logged</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}>
                  <div className="text-3xl font-bold text-primary-glow">85%</div>
                  <div className="text-sm text-white/80">Waste Reduced</div>
                </div>
              </div>

              <div className="hidden lg:block">
                <h3 className="text-2xl font-semibold mb-6">Why Choose EcoTracker?</h3>
                <div className="grid grid-cols-1 gap-4">
                  {features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <feature.icon className="h-6 w-6 text-primary-glow flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">{feature.title}</h4>
                        <p className="text-sm text-white/80">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Auth Form */}
            <div className="flex justify-center lg:justify-end">
              {isLoginMode ? (
                <LoginForm onToggleMode={() => setIsLoginMode(false)} />
              ) : (
                <SignupForm onToggleMode={() => setIsLoginMode(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need for Sustainable Living
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform helps individuals and communities track, 
              manage, and reduce their environmental impact through innovative tools and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-card rounded-lg shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of eco-conscious individuals and communities 
            already reducing their environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsLoginMode(false)}
              className="px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors duration-300 shadow-glow"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => setIsLoginMode(true)}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;