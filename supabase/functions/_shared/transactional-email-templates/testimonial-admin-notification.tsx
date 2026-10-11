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
  authorName?: string
  message?: string
  hasPhoto?: boolean
}

const TestimonialAdminNotificationEmail = ({
  authorName = '',
  message = '',
  hasPhoto = false,
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Nouveau témoignage de {authorName} en attente de validation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Nouveau témoignage en attente</Heading>
        <Text style={text}>
          <strong>Adoptant :</strong> {authorName}
        </Text>
        <Text style={text}>
          <strong>Photo jointe :</strong> {hasPhoto ? 'Oui' : 'Non'}
        </Text>
        <Text style={text}>
          <strong>Témoignage :</strong>
        </Text>
        <Text style={messageBox}>{message}</Text>
        <Text style={text}>
          Connectez-vous à l'administration du Domaine des Licornes Seal, onglet « Témoignages », pour le publier ou le refuser.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TestimonialAdminNotificationEmail,
  subject: (data: Record<string, any>) => `Témoignage à valider : ${data?.authorName || ''}`,
  displayName: 'Testimonial admin notification',
  to: 'Laurence.Pouyaud@orange.fr',
  previewData: {
    authorName: 'Marie Dupont',
    message: 'Une expérience merveilleuse, notre chaton est adorable !',
    hasPhoto: true,
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

export default TestimonialAdminNotificationEmail
