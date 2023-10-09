import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/community',
    '/api/webhook',
  ],
  ignoredRoutes: [
    '/api/webhook', '/api/chatgpt'
  ]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
