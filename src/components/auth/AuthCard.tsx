import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="text-gray-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-8 pb-8">{children}</CardContent>
    </Card>
  );
};
