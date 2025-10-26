import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { UseFormRegister } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  register:
    | UseFormRegister<{ password: string }>
    | UseFormRegister<{ email: string; password: string }>
    | UseFormRegister<{
        fullName: string;
        email: string;
        password: string;
        confirmPassword: string;
      }>;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  className?: string;
}

export const PasswordInput = ({
  id,
  label,
  placeholder,
  register,
  error,
  showPassword,
  onTogglePassword,
  className = "",
}: PasswordInputProps) => {
  const registerFn = register as (name: string) => object;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-white font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-purple-400 focus:ring-purple-400/20 pr-10"
          {...registerFn(id)}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={onTogglePassword}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-400" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
};
