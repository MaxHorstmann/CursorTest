export function getAnonymousUserId(): string {
  if (typeof window === 'undefined') return '';
  
  let userId = document.cookie
    .split('; ')
    .find(row => row.startsWith('anonymous_user_id='))
    ?.split('=')[1];

  if (!userId) {
    userId = crypto.randomUUID();
    document.cookie = `anonymous_user_id=${userId}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }

  return userId;
} 