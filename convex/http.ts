import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";


const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
  const payload = await req.text();

  const id = req.headers.get("svix-id");
  const timestamp = req.headers.get("svix-timestamp");
  const signature = req.headers.get("svix-signature");

  if (!id || !timestamp || !signature) {
    return undefined;
  }

  const svixHeaders = {
    "svix-id": id,
    "svix-timestamp": timestamp,
    "svix-signature": signature,
  };

  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    return webhook.verify(payload, svixHeaders) as WebhookEvent;
  } catch (error) {
    console.error("❌ Clerk webhook request could not be verified");
  }
};

// Narrow the internal API typing to avoid TS issues in Next build context
const internalApi = internal as unknown as {
  user: {
    get: any;
    create: any;
  };
};

const handleClerkWebhook = httpAction(async (ctx, req) => {
  const event = await validatePayload(req);

  if (!event) {
    return new Response("could not validate payload", { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const user = await ctx.runQuery(internalApi.user.get, {
        clerkId: event.data.id,
      });

      if (user) {
        console.log(`✅ User ${event.data.id} already exists, updating...`);
      } else {
        console.log(`🆕 Creating new user ${event.data.id}`);
      }

      await ctx.runMutation(internalApi.user.create, {
        username:event.data.username ?? "",
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address ?? "",
      });

      break;
    }

    case "user.updated": {
      console.log(`♻️ Updating user ${event.data.id}`);

      await ctx.runMutation(internalApi.user.create, {
        username: `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim() || event.data.username || "",
        imageUrl: event.data.image_url,
        clerkId: event.data.id,
        email: event.data.email_addresses[0]?.email_address ?? "",
      });

      break;
    }

    default: {
      console.log("ℹ️ Clerk webhook event not supported:", event.type);
    }
  }

  return new Response("ok", { status: 200 });
});

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

export default http;
