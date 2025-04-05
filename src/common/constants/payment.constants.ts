export const CASHFREE_PAYMENT_STATUS = {
  SUCCESS: { code: 'SUCCESS', name: 'Success' },
  NOT_ATTEMPTED: { code: 'NOT_ATTEMPTED', name: 'Not Attempted' },
  FAILED: { code: 'FAILED', name: 'Failed' },
  USER_DROPPED: { code: 'USER_DROPPED', name: 'User Dropped' },
  VOID: { code: 'VOID', name: 'Void' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled' },
  PENDING: { code: 'PENDING', name: 'Pending' },
};

export const PAYMENT_STATUS = {
  PENDING: { code: 'PENDING', name: 'Pending' },
  COMPLETED: { code: 'COMPLETED', name: 'Completed' },
  CANCELLED: { code: 'CANCELLED', name: 'Cancelled' },
  FAILED: { code: 'FAILED', name: 'Failed' },
} as const;

export const PAYMENT_METHOD = {
  CASHFREE: { code: 'CASHFREE', name: 'Cashfree' },
} as const;
