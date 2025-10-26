// src/lib/config.ts
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  app: {
    name: string;
    version: string;
    environment: "development" | "staging" | "production";
    debug: boolean;
  };
  features: {
    notifications: boolean;
  };
  limits: {
    maxFileSize: number;
    maxParkingSpots: number;
    maxReservationDays: number;
  };
  urls: {
    support: string;
    privacy: string;
    terms: string;
  };
}

const getEnvironment = (): "development" | "staging" | "production" => {
  const env = import.meta.env.MODE;
  if (env === "production") return "production";
  if (env === "staging") return "staging";
  return "development";
};

export const config: AppConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321",
    anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  },
  app: {
    name: "Vayno Parking Management",
    version: "1.0.0",
    environment: getEnvironment(),
    debug: getEnvironment() === "development",
  },
  features: {
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== "false",
  },
  limits: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "10485760"), // 10MB
    maxParkingSpots: parseInt(import.meta.env.VITE_MAX_PARKING_SPOTS || "1000"),
    maxReservationDays: parseInt(
      import.meta.env.VITE_MAX_RESERVATION_DAYS || "30"
    ),
  },
  urls: {
    support: import.meta.env.VITE_SUPPORT_URL || "mailto:support@vayno.com",
    privacy: import.meta.env.VITE_PRIVACY_URL || "/privacy",
    terms: import.meta.env.VITE_TERMS_URL || "/terms",
  },
};

// Validation
export const validateConfig = (): void => {
  const errors: string[] = [];

  if (!config.supabase.url) {
    errors.push("VITE_SUPABASE_URL is required");
  }

  if (!config.supabase.anonKey) {
    errors.push("VITE_SUPABASE_PUBLISHABLE_KEY is required");
  }

  if (config.limits.maxFileSize <= 0) {
    errors.push("VITE_MAX_FILE_SIZE must be positive");
  }

  if (config.limits.maxParkingSpots <= 0) {
    errors.push("VITE_MAX_PARKING_SPOTS must be positive");
  }

  if (config.limits.maxReservationDays <= 0) {
    errors.push("VITE_MAX_RESERVATION_DAYS must be positive");
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n${errors.join("\n")}`);
  }
};

// Feature flags
export const isFeatureEnabled = (
  feature: keyof AppConfig["features"]
): boolean => {
  return config.features[feature];
};

// Environment checks
export const isDevelopment = (): boolean =>
  config.app.environment === "development";
export const isProduction = (): boolean =>
  config.app.environment === "production";
export const isStaging = (): boolean => config.app.environment === "staging";

// Initialize configuration
export const initializeConfig = (): void => {
  validateConfig();
};
