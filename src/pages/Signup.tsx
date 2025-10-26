import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus } from "lucide-react";
import { ErrorMessage } from "@/components/ui/error-message";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/layout";
import {
  AuthCard,
  SubmitButton,
  PasswordRequirements,
} from "@/components/auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/utils";
import { useSignupForm } from "@/hooks/useAuth";

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error,
    isLoading,
    errors,
  } = useSignupForm();

  return (
    <AuthLayout backNavigation={() => navigate(ROUTES.HOME)}>
      <AuthCard
        title="Create Account"
        description="Join Vayno and start managing your parking business"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20"
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              {...register("fullName")}
            />
            <ErrorMessage message={errors.fullName?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20"
              autoComplete="off"
              data-lpignore="true"
              data-form-type="other"
              {...register("email")}
            />
            <ErrorMessage message={errors.email?.message} />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Create a secure password"
            register={register}
            error={errors.password?.message}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <PasswordRequirements />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            register={register}
            error={errors.confirmPassword?.message}
            showPassword={showConfirmPassword}
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          />

          <div className="pt-6">
            <SubmitButton
              isLoading={isLoading}
              icon={UserPlus}
              loadingText="Creating Account..."
              defaultText="Create Account"
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Signup;
