import { useState, useMemo, useEffect, useCallback } from "react";
import type { VehicleType, VehicleCheckInFormData } from "@/types";
import { normalizeVehiclePlate } from "@/lib/utils";

interface UseParkingCheckinFormProps {
  open: boolean;
  onSubmit: (data: VehicleCheckInFormData) => void;
}

const DEFAULT_VEHICLE_TYPE: VehicleType = "car";

export const useParkingCheckinForm = ({
  open,
  onSubmit,
}: UseParkingCheckinFormProps) => {
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleType, setVehicleType] =
    useState<VehicleType>(DEFAULT_VEHICLE_TYPE);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const resetForm = useCallback(() => {
    setVehiclePlate("");
    setVehicleType(DEFAULT_VEHICLE_TYPE);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
  }, []);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!vehiclePlate.trim()) return;

      const formData: VehicleCheckInFormData = {
        vehiclePlate: normalizeVehiclePlate(vehiclePlate),
        vehicleType,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
      };

      onSubmit(formData);
      resetForm();
    },
    [
      vehiclePlate,
      vehicleType,
      customerName,
      customerPhone,
      customerEmail,
      onSubmit,
      resetForm,
    ]
  );

  const isValid = useMemo(() => {
    return vehiclePlate.trim().length > 0;
  }, [vehiclePlate]);

  return {
    vehiclePlate,
    vehicleType,
    customerName,
    customerPhone,
    customerEmail,

    setVehiclePlate,
    setVehicleType,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    handleSubmit,
    resetForm,

    isValid,
  };
};
