import type { ComponentType } from 'npm:react@18.3.1'
import { template as contactConfirmation } from './contact-confirmation.tsx'
import { template as contactAdminNotification } from './contact-admin-notification.tsx'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'contact-confirmation': contactConfirmation,
  'contact-admin-notification': contactAdminNotification,
}
