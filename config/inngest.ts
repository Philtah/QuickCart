import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User"; // Ensure this is the default export of the Mongoose model, not a type

// Create a client to send and receive events
export const inngest = new Inngest({ id: "WPtech" });

/**
 * Sync Clerk user creation → DB
 */
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id, // 👈 make sure your Mongoose schema allows _id to be a string
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses?.[0]?.email_address ?? null,
      imageUrl: image_url ?? null,
    };

    await connectDB();

    // Prevent duplicate users if Clerk retries event
    await (User as any).findByIdAndUpdate(id, userData, { upsert: true, new: true });

    return { message: "User created/updated", user: userData };
  }
);

/**
 * Sync Clerk user update → DB
 */
export const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const updatedUserData = {
      name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
      email: email_addresses?.[0]?.email_address ?? null,
      imageUrl: image_url ?? null,
    };

    await connectDB();
    await (User as any).findByIdAndUpdate(id, updatedUserData);

    return { message: "User updated", user: updatedUserData };
  }
);

/**
 * Sync Clerk user deletion → DB
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await (User as any).findByIdAndDelete(id);

    return { message: "User deleted", userId: id };
  }
);
