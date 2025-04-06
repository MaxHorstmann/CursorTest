export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') {
    return 'anonymous';
  }

  let anonymousId = localStorage.getItem('anonymous_user_id');
  if (!anonymousId) {
    anonymousId = `anon-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('anonymous_user_id', anonymousId);
  }
  return anonymousId;
} 