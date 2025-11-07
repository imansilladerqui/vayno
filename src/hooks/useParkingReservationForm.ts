import { useState, useMemo, useEffect, useCallback } from "react";
import { format } from "date-fns";
import type { VehicleType, VehicleCheckInFormData } from "@/types";
import { normalizeVehiclePlate } from "@/lib/utils";

interface UseParkingReservationFormProps {
  open: boolean;
  onSubmit: (data: VehicleCheckInFormData) => void;
}

const DEFAULT_VEHICLE_TYPE: VehicleType = "car";

const getNextTimeSlot = (date: Date): string => {
  const nextSlot = new Date(date);
  nextSlot.setMinutes(Math.ceil(nextSlot.getMinutes() / 15) * 15);
  nextSlot.setSeconds(0);
  nextSlot.setMilliseconds(0);

  if (nextSlot.getMinutes() >= 60) {
    nextSlot.setHours(nextSlot.getHours() + 1);
    nextSlot.setMinutes(0);
  }

  return format(nextSlot, "HH:mm");
};

const isTimeInPast = (dateStr: string, timeStr: string): boolean => {
  const timeDate = new Date(`${dateStr}T${timeStr}:00`);
  return timeDate <= new Date();
};

export const useParkingReservationForm = ({
  open,
  onSubmit,
}: UseParkingReservationFormProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState<string>("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleType, setVehicleType] =
    useState<VehicleType>(DEFAULT_VEHICLE_TYPE);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const isToday = startDate === today;

  const timeSlots = useMemo(() => {
    const slots: string[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        if (isToday && isTimeInPast(startDate, timeString)) {
          continue;
        }

        slots.push(timeString);
      }
    }
    return slots;
  }, [startDate, isToday]);

  useEffect(() => {
    if (open && !startTime) {
      const nextTime = getNextTimeSlot(new Date());
      setStartTime(nextTime);
    }
  }, [open, startTime]);

  const handleDateChange = useCallback(
    (selectedDate: string) => {
      setStartDate(selectedDate);

      if (
        startTime &&
        selectedDate === today &&
        isTimeInPast(selectedDate, startTime)
      ) {
        setStartTime(getNextTimeSlot(new Date()));
      }
    },
    [startTime, today]
  );

  const resetForm = useCallback(() => {
    setVehiclePlate("");
    setVehicleType(DEFAULT_VEHICLE_TYPE);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setStartDate(today);
    setStartTime("");
  }, [today]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!vehiclePlate.trim() || !startTime) return;

      const startDateTime = new Date(
        `${startDate}T${startTime}:00`
      ).toISOString();

      const formData: VehicleCheckInFormData = {
        vehiclePlate: normalizeVehiclePlate(vehiclePlate),
        vehicleType,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        startDate,
        startTime: startDateTime,
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
      startDate,
      startTime,
      onSubmit,
      resetForm,
    ]
  );

  const isValid = useMemo(() => {
    return vehiclePlate.trim().length > 0 && startTime.length > 0;
  }, [vehiclePlate, startTime]);

  return {
    startDate,
    startTime,
    vehiclePlate,
    vehicleType,
    customerName,
    customerPhone,
    customerEmail,

    setStartDate: handleDateChange,
    setStartTime,
    setVehiclePlate,
    setVehicleType,
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    handleSubmit,
    resetForm,

    timeSlots,
    isValid,
  };
};
