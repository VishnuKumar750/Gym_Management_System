export enum Day {
  MON = 'Mon',
  TUE = 'Tues',
  WED = 'Wed',
  THUR = 'Thur',
  FRI = 'Fri',
  SAT = 'Sat',
  SUN = 'Sun',
}

export enum MembershipPlan {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export const OrderDays = Object.values(Day);
