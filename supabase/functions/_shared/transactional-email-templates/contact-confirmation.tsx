import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  message?: string
  phone?: string
  country?: string
  email?: string
  language?: 'fr' | 'en' | 'es'
}

const translations = {
  fr: {
    subject: 'Confirmation de votre message - Le Domaine des Licornes Seal',
    preview: 'Nous avons bien reçu votre message',
    greeting: 'Bonjour',
    received: 'Nous avons bien reçu votre message et nous vous en remercions.',
    reply: 'Notre équipe prendra connaissance de votre demande et vous répondra dans les plus brefs délais.',
    yourMessage: 'Votre message :',
    contact: 'Nous vous contacterons',
    at: "à l'adresse",
    or: 'ou',
    soonFrom: 'À très bientôt,',
    team: "L'équipe du Domaine des Licornes Seal",
    footer: 'Élevage de Ragdolls • Le Domaine des Licornes Seal',
  },
  en: {
    subject: 'Message confirmation - Le Domaine des Licornes Seal',
    preview: 'We have received your message',
    greeting: 'Hello',
    received: 'We have received your message and thank you for it.',
    reply: 'Our team will review your request and respond to you as soon as possible.',
    yourMessage: 'Your message:',
    contact: 'We will contact you',
    at: 'at',
    or: 'or',
    soonFrom: 'See you soon,',
    team: 'The Team at Le Domaine des Licornes Seal',
    footer: 'Ragdoll Breeding • Le Domaine des Licornes Seal',
  },
  es: {
    subject: 'Confirmación de tu mensaje - Le Domaine des Licornes Seal',
    preview: 'Hemos recibido tu mensaje',
    greeting: 'Hola',
    received: 'Hemos recibido tu mensaje y te lo agradecemos.',
    reply: 'Nuestro equipo revisará tu solicitud y te responderá lo antes posible.',
    yourMessage: 'Tu mensaje:',
    contact: 'Te contactaremos',
    at: 'en',
    or: 'o',
    soonFrom: 'Hasta pronto,',
    team: 'El equipo de Le Domaine des Licornes Seal',
    footer: 'Criador de Ragdolls • Le Domaine des Licornes Seal',
  },
}

const ContactConfirmationEmail = ({
  name = '',
  message = '',
  phone,
  country,
  email = '',
  language = 'fr',
}: Props) => {
  const t = translations[language] || translations.fr
  const shortMessage = message.length > 200 ? `${message.substring(0, 200)}...` : message

  return (
    <Html lang={language} dir="ltr">
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={header}>
            <Img
              src="https://sayvcchuqjrdpjluhhvn.supabase.co/storage/v1/object/public/domain-gallery/1763650988576_Dame_Licorne-Mon_seul_d_sir-Zoom.jpg"
              alt="Licorne"
              width="56"
              height="56"
              style={headerImg}
            />
            Le Domaine des Licornes Seal
          </Heading>
          <Container style={content}>
            <Text style={text}>
              {t.greeting} <span style={highlight}>{name}</span>,
            </Text>
            <Text style={text}>{t.received}</Text>
            <Text style={text}>{t.reply}</Text>
            <Text style={text}>
              {t.yourMessage}
              <br />
              <em>"{shortMessage}"</em>
            </Text>
            {phone || country ? (
              <Text style={text}>
                {t.contact}
                {phone ? ` ${phone} ${t.or}` : ''} {t.at} {email}
                {country ? ` (${country})` : ''}.
              </Text>
            ) : null}
            <Text style={text}>
              {t.soonFrom}
              <br />
              <strong>{t.team}</strong>
            </Text>
          </Container>
          <Text style={footer}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactConfirmationEmail,
  subject: (data: Record<string, any>) =>
    (translations[(data?.language as 'fr' | 'en' | 'es')] || translations.fr).subject,
  displayName: 'Contact form confirmation',
  previewData: {
    name: 'Marie',
    message: 'Bonjour, je suis intéressée par un chaton Ragdoll.',
    phone: '06 12 34 56 78',
    country: 'France',
    email: 'marie@example.com',
    language: 'fr',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  border: '2px solid #0B1B3F',
  borderRadius: '8px',
  overflow: 'hidden',
}
const header = {
  backgroundColor: '#0B1B3F',
  color: '#D4AF37',
  padding: '30px 20px',
  textAlign: 'center' as const,
  fontSize: '26px',
  fontStyle: 'italic',
  margin: 0,
}
const headerImg = {
  border: '3px solid #D4AF37',
  borderRadius: '12px',
  verticalAlign: 'middle',
  marginRight: '10px',
  backgroundColor: '#ffffff',
  padding: '4px',
}
const content = { padding: '30px 20px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.6', margin: '15px 0' }
const highlight = { color: '#0B1B3F', fontWeight: 'bold' as const }
const footer = {
  backgroundColor: '#0B1B3F',
  color: '#D4AF37',
  padding: '20px',
  textAlign: 'center' as const,
  fontSize: '13px',
  margin: 0,
}

export default ContactConfirmationEmail
