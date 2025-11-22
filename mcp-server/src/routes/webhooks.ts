/**
 * Webhook Routes
 *
 * Express router for handling webhook events from external services.
 * Implements HMAC signature verification for security.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';

// Environment variables
const WEBHOOK_SECRET_COMPASS = process.env.WEBHOOK_SECRET_COMPASS ?? '';

/**
 * Supported webhook event types
 */
export type WebhookEventType =
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'user_created'
  | 'user_updated';

/**
 * Base webhook payload structure
 */
export interface WebhookPayload {
  event: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Subscription event data
 */
export interface SubscriptionEventData {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  status: string;
  started_at?: string;
  cancelled_at?: string;
  metadata?: Record<string, unknown>;
}

/**
 * User event data
 */
export interface UserEventData {
  user_id: string;
  email?: string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Webhook verification result
 */
interface SignatureVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Verifies HMAC signature of webhook payload
 *
 * @param payload - Raw request body as string
 * @param signature - Signature from request header
 * @param secret - Webhook secret key
 * @returns Verification result
 */
function verifyWebhookSignature(
  payload: string,
  signature: string | undefined,
  secret: string
): SignatureVerificationResult {
  if (!signature) {
    return {
      valid: false,
      error: 'Missing signature header',
    };
  }

  if (!secret) {
    return {
      valid: false,
      error: 'Webhook secret not configured',
    };
  }

  try {
    // Expected format: sha256=<hex_signature>
    const [algorithm, providedSignature] = signature.split('=');

    if (algorithm !== 'sha256' || !providedSignature) {
      return {
        valid: false,
        error: 'Invalid signature format',
      };
    }

    // Compute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!isValid) {
      return {
        valid: false,
        error: 'Invalid signature',
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('[Webhook] Signature verification error:', error);
    return {
      valid: false,
      error: 'Signature verification failed',
    };
  }
}

/**
 * Validates webhook payload structure
 */
function validatePayload(body: unknown): body is WebhookPayload {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const payload = body as Record<string, unknown>;

  return (
    typeof payload.event === 'string' &&
    typeof payload.timestamp === 'string' &&
    typeof payload.data === 'object' &&
    payload.data !== null
  );
}

/**
 * Checks if event type is valid
 */
function isValidEventType(event: string): event is WebhookEventType {
  const validEvents: WebhookEventType[] = [
    'subscription_created',
    'subscription_updated',
    'subscription_cancelled',
    'user_created',
    'user_updated',
  ];
  return validEvents.includes(event as WebhookEventType);
}

/**
 * Handles subscription_created event
 */
async function handleSubscriptionCreated(data: SubscriptionEventData): Promise<void> {
  console.log('[Webhook] Processing subscription_created:', {
    subscription_id: data.subscription_id,
    user_id: data.user_id,
    plan_id: data.plan_id,
    status: data.status,
  });

  // TODO: Implement subscription creation logic
  // - Update user permissions in database
  // - Send welcome notification
  // - Sync with billing system
}

/**
 * Handles subscription_updated event
 */
async function handleSubscriptionUpdated(data: SubscriptionEventData): Promise<void> {
  console.log('[Webhook] Processing subscription_updated:', {
    subscription_id: data.subscription_id,
    user_id: data.user_id,
    plan_id: data.plan_id,
    status: data.status,
  });

  // TODO: Implement subscription update logic
  // - Update user permissions based on plan changes
  // - Handle plan upgrades/downgrades
  // - Update billing records
}

/**
 * Handles subscription_cancelled event
 */
async function handleSubscriptionCancelled(data: SubscriptionEventData): Promise<void> {
  console.log('[Webhook] Processing subscription_cancelled:', {
    subscription_id: data.subscription_id,
    user_id: data.user_id,
    cancelled_at: data.cancelled_at,
  });

  // TODO: Implement subscription cancellation logic
  // - Revoke premium permissions
  // - Send cancellation confirmation
  // - Schedule data retention cleanup
}

/**
 * Handles user_created event
 */
async function handleUserCreated(data: UserEventData): Promise<void> {
  console.log('[Webhook] Processing user_created:', {
    user_id: data.user_id,
    email: data.email,
    created_at: data.created_at,
  });

  // TODO: Implement user creation logic
  // - Initialize user profile
  // - Set default permissions
  // - Send onboarding notification
}

/**
 * Handles user_updated event
 */
async function handleUserUpdated(data: UserEventData): Promise<void> {
  console.log('[Webhook] Processing user_updated:', {
    user_id: data.user_id,
    email: data.email,
    updated_at: data.updated_at,
  });

  // TODO: Implement user update logic
  // - Sync profile changes
  // - Update cached user data
  // - Trigger relevant notifications
}

/**
 * Creates the webhook router
 */
export function createWebhookRouter(): Router {
  const router = Router();

  /**
   * POST /api/webhooks/compass
   *
   * Receives webhook events from Compass Navigator service.
   * Requires HMAC signature verification via X-Webhook-Signature header.
   */
  router.post('/compass', async (req: Request, res: Response) => {
    const startTime = Date.now();
    const requestId = `wh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    console.log(`[Webhook] ${requestId} - Received request`);

    try {
      // Get raw body for signature verification
      // Note: express.json() middleware should preserve raw body or use express.raw()
      const rawBody = JSON.stringify(req.body);
      const signature = req.headers['x-webhook-signature'] as string | undefined;

      // Verify signature
      const verificationResult = verifyWebhookSignature(
        rawBody,
        signature,
        WEBHOOK_SECRET_COMPASS
      );

      if (!verificationResult.valid) {
        console.warn(`[Webhook] ${requestId} - Signature verification failed:`, verificationResult.error);
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: verificationResult.error,
          request_id: requestId,
        });
        return;
      }

      // Validate payload structure
      if (!validatePayload(req.body)) {
        console.warn(`[Webhook] ${requestId} - Invalid payload structure`);
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Invalid payload structure',
          request_id: requestId,
        });
        return;
      }

      const { event, timestamp, data } = req.body as WebhookPayload;

      // Validate event type
      if (!isValidEventType(event)) {
        console.warn(`[Webhook] ${requestId} - Unknown event type: ${event}`);
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: `Unknown event type: ${event}`,
          request_id: requestId,
        });
        return;
      }

      console.log(`[Webhook] ${requestId} - Processing event: ${event}, timestamp: ${timestamp}`);

      // Route to appropriate handler
      switch (event) {
        case 'subscription_created':
          await handleSubscriptionCreated(data as unknown as SubscriptionEventData);
          break;
        case 'subscription_updated':
          await handleSubscriptionUpdated(data as unknown as SubscriptionEventData);
          break;
        case 'subscription_cancelled':
          await handleSubscriptionCancelled(data as unknown as SubscriptionEventData);
          break;
        case 'user_created':
          await handleUserCreated(data as unknown as UserEventData);
          break;
        case 'user_updated':
          await handleUserUpdated(data as unknown as UserEventData);
          break;
      }

      const processingTime = Date.now() - startTime;
      console.log(`[Webhook] ${requestId} - Event processed successfully in ${processingTime}ms`);

      res.status(200).json({
        success: true,
        message: 'Event processed successfully',
        request_id: requestId,
        event,
        processing_time_ms: processingTime,
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error(`[Webhook] ${requestId} - Error processing webhook:`, error);

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to process webhook event',
        request_id: requestId,
        processing_time_ms: processingTime,
      });
    }
  });

  return router;
}

/**
 * Validates that webhook secrets are configured
 */
export function validateWebhookEnvironment(): void {
  if (!WEBHOOK_SECRET_COMPASS) {
    console.warn('[Webhook] WEBHOOK_SECRET_COMPASS not configured - webhook signature verification will fail');
  }
}
