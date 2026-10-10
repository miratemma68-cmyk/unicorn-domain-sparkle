import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  name?: string
  email?: string
  phone?: string
  country?: string
  language?: string
  message?: string
}

const ContactAdminNotificationEmail = ({
  name = '',
  email = '',
  phone,
  country,
  language = 'fr',
  message = '',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouveau message de contact de {name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nouveau message de contact</Heading>
        <Text style={text}>
          <strong>Nom :</strong> {name}
        </Text>
        <Text style={text}>
          <strong>Email :</strong> {email}
        </Text>
        {phone ? (
          <Text style={text}>
            <strong>Téléphone :</strong> {phone}
          </Text>
        ) : null}
        {country ? (
          <Text style={text}>
            <strong>Pays :</strong> {country}
          </Text>
        ) : null}
        <Text style={text}>
          <strong>Langue :</strong> {language}
        </Text>
        <Text style={text}>
          <strong>Message :</strong>
        </Text>
        <Text style={messageBox}>{message}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactAdminNotificationEmail,
  subject: (data: Record<string, any>) => `Nouveau contact : ${data?.name || ''}`,
  displayName: 'Contact admin notification',
  to: 'Laurence.Pouyaud@orange.fr',
  previewData: {
    name: 'Marie Dupont',
    email: 'marie@example.com',
    phone: '06 12 34 56 78',
    country: 'France',
    language: 'fr',
    message: 'Bonjour, je suis intéressée par un chaton Ragdoll.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '20px 25px' }
const h1 = { fontSize: '20px', color: '#0B1B3F', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#333333', lineHeight: '1.5', margin: '8px 0' }
const messageBox = {
  fontSize: '14px',
  color: '#333333',
  backgroundColor: '#f5f5f5',
  padding: '12px',
  borderRadius: '8px',
  whiteSpace: 'pre-line' as const,
}

export default ContactAdminNotificationEmail
