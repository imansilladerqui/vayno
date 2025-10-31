import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "@/components/ui/error-message";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthLayout } from "@/components/layout";
import { AuthCard, SubmitButton } from "@/components/auth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/lib/utils";
import { useSigninForm } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    onSubmit,
    showPassword,
    setShowPassword,
    error,
    errors,
  } = useSigninForm();

  return (
    <AuthLayout backNavigation={() => navigate(ROUTES.HOME)}>
      <AuthCard
        title="Sign In"
        description="Enter your credentials to access your dashboard"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert className="bg-red-500/10 border-red-500/20 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
            placeholder="Enter your password"
            register={register}
            error={errors.password?.message}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <div className="pt-6">
            <SubmitButton icon={LogIn} defaultText="Sign In" />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default Login;
