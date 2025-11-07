import { User } from "lucide-react";
import { InfoRow } from "./InfoRow";

interface CustomerInfoProps {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  label?: string;
}

export const CustomerInfo = ({
  name,
  email,
  phone,
  label = "Consumer",
}: CustomerInfoProps) => {
  if (!name && !email && !phone) return null;

  return (
    <InfoRow
      icon={User}
      iconBg="bg-green-100 dark:bg-green-900/20"
      iconColor="text-green-600 dark:text-green-400"
      label={label}
      value={name || undefined}
      secondary={email || undefined}
      tertiary={phone || undefined}
    />
  );
};

