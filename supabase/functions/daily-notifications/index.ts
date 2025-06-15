
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh_key: string;
  auth_key: string;
  is_active: boolean;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VAPID_PRIVATE_KEY = "VHaIyqZJmO6A4XvGxJxJHPb1N2G8hNa1W6xKxQn7YUU"; // This should be stored as a secret
const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa40HI2PacGgOgjJqkUCzpjOj7Fs9fZ-1VZAU47zZTI3bJ5HBAmwDJM6X8jHXU";

const dailyTips = [
  "💡 Try asking Makab AI to explain complex topics in simple terms!",
  "🚀 Use Makab AI to brainstorm creative solutions to your problems.",
  "📚 Ask Makab AI to summarize long articles or documents for you.",
  "🎯 Set specific goals and let Makab AI help you create action plans.",
  "🔍 Use Makab AI to research topics you're curious about.",
  "✨ Try creative writing prompts with Makab AI for inspiration.",
  "🧠 Ask Makab AI to help you learn new skills step by step.",
  "📝 Use Makab AI to help structure your thoughts and ideas.",
  "🤝 Let Makab AI be your study buddy for exams and learning.",
  "🎨 Explore creative projects with Makab AI's assistance.",
];

async function sendPushNotification(subscription: PushSubscription, payload: any) {
  try {
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'TTL': '86400', // 24 hours
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Failed to send push notification: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch all active push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching subscriptions:', error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch subscriptions" }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active subscriptions found" }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Send up to 3 different notifications throughout the day
    const notificationTimes = [
      { hour: 9, message: "🌅 Good morning! Start your day with Makab AI." },
      { hour: 14, message: "☀️ Afternoon boost! Let Makab AI help you stay productive." },
      { hour: 19, message: "🌙 Evening inspiration! End your day with AI insights." }
    ];

    const currentHour = new Date().getHours();
    const currentNotification = notificationTimes.find(n => n.hour === currentHour);

    if (!currentNotification) {
      return new Response(
        JSON.stringify({ message: "No notification scheduled for this hour" }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Get a random tip
    const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

    const payload = {
      title: "Makab AI Daily Tip",
      body: `${currentNotification.message}\n\n${randomTip}`,
      icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
      badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
      data: {
        url: '/',
        timestamp: Date.now()
      }
    };

    let successCount = 0;
    let failureCount = 0;

    // Send notifications to all active subscriptions
    for (const subscription of subscriptions) {
      const success = await sendPushNotification(subscription, payload);
      if (success) {
        successCount++;
      } else {
        failureCount++;
        // Optionally deactivate failed subscriptions
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false })
          .eq('id', subscription.id);
      }
    }

    return new Response(
      JSON.stringify({
        message: "Daily notifications sent",
        successCount,
        failureCount,
        totalSubscriptions: subscriptions.length
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in daily-notifications function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
};

serve(handler);
