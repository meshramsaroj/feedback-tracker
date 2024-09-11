import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(6, { message: "Message must be at least 6 character" })
    .max(300, { message: "Message must not more than 300 characters" }),
});
