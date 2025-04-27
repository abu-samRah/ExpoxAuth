import { withAuth } from "@/utils/middleware";

export const GET = withAuth(async (req, user) => {
  return Response.json({
    message: "Hello, world!",
    user: { name: user.name, email: user.email },
  });
});
