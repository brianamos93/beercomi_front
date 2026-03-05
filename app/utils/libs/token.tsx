export function requireToken(token: string | undefined): string {
  if (!token) {
    throw new Error("Token missing");
  }
  return token;
}