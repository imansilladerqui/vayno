export const PARKING_SESSION_SELECT = `
  *,
  parking_spots!inner(
    *,
    businesses!inner(*)
  ),
  profiles(*)
`;

export const PARKING_SESSION_SELECT_WITHOUT_PROFILES = `
  *,
  parking_spots!inner(
    *,
    businesses!inner(*)
  )
`;

export const RESERVATION_SELECT = `
  *,
  parking_spots!inner(
    id,
    spot_number,
    businesses!inner(
      id,
      name
    )
  ),
  profiles(*)
`;
