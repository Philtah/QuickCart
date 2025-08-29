import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import {
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
  ],
});
