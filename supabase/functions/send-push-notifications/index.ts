
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const webPush = {
  setVapidDetails: (subject: string, publicKey: string, privateKey: string) => {
    // Store VAPID details
  },
  sendNotification: async (subscription: any, payload: string) => {
    // Implement web push sending logic
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'TTL': '86400',
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'Authorization': `vapid t=${await generateVAPIDToken()}, k=${Deno.env.get('VAPID_PUBLIC_KEY')}`
      },
      body: payload
    });
    return response;
  }
};

async function generateVAPIDToken(): Promise<string> {
  // Generate VAPID JWT token
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: 'https://fcm.googleapis.com',
    exp: Math.floor(Date.now() / 1000) + 86400,
    sub: 'mailto:your-email@domain.com'
  };
  
  // This is a simplified version - in production, use proper JWT signing
  return 'vapid-token';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { notificationType, userId } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get notification templates for the specified type and time
    const currentHour = new Date().getHours();
    const timeSlot = currentHour < 12 ? 'morning' : 'evening';
    
    const { data: templates, error: templatesError } = await supabase
      .from('notification_templates')
      .select('*')
      .eq('notification_type', notificationType || 'daily')
      .eq('time_slot', timeSlot)
      .eq('is_active', true);

    if (templatesError) {
      throw new Error(`Error fetching templates: ${templatesError.message}`);
    }

    if (!templates || templates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No templates found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Select a random template
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    // Get active push subscriptions
    let subscriptionsQuery = supabase
      .from('push_subscriptions')
      .select('*')
      .eq('is_active', true);
      
    if (userId) {
      subscriptionsQuery = subscriptionsQuery.eq('user_id', userId);
    }
    
    const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery;

    if (subscriptionsError) {
      throw new Error(`Error fetching subscriptions: ${subscriptionsError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare notification payload
    const notificationPayload = {
      title: randomTemplate.title,
      body: randomTemplate.body,
      icon: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
      badge: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
      data: {
        url: '/',
        timestamp: Date.now(),
        type: notificationType || 'daily'
      }
    };

    // Send notifications to all subscribers
    const results = [];
    
    for (const subscription of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh_key,
            auth: subscription.auth_key
          }
        };

        // Send the notification (simplified - use proper web-push library in production)
        const response = await fetch(subscription.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload)
        });

        if (response.ok) {
          // Log successful notification
          await supabase
            .from('notification_logs')
            .insert({
              user_id: subscription.user_id,
              title: randomTemplate.title,
              body: randomTemplate.body,
              icon_url: '/lovable-uploads/7ba237d8-d482-44ec-b85b-c5b82d878782.png',
              notification_type: notificationType || 'daily'
            });
          
          results.push({ userId: subscription.user_id, status: 'sent' });
        } else {
          results.push({ userId: subscription.user_id, status: 'failed', error: response.statusText });
        }
      } catch (error) {
        console.error(`Error sending to user ${subscription.user_id}:`, error);
        results.push({ userId: subscription.user_id, status: 'error', error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Notifications processed',
        results: results,
        template: randomTemplate.title
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-push-notifications function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to create Supabase client
function createClient(supabaseUrl: string, supabaseKey: string) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          eq: (column2: string, value2: any) => ({
            eq: (column3: string, value3: any) => ({
              // Simplified query builder - use actual Supabase client in production
              then: async (callback: any) => callback({ data: [], error: null })
            })
          })
        })
      }),
      insert: (data: any) => ({
        then: async (callback: any) => callback({ data: null, error: null })
      })
    })
  };
}
