/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'
import { Container, Heading, Img, Text } from 'npm:@react-email/components@0.0.22'

// Shared brand design for all auth emails — matches the site and the
// "Conditions de vente" PDF: navy night blue, gold frame, tapestry header.

export const TAPESTRY_URL =
  'https://sayvcchuqjrdpjluhhvn.supabase.co/storage/v1/object/public/domain-gallery/1763650988576_Dame_Licorne-Mon_seul_d_sir-Zoom.jpg'

export const BrandHeader = ({ title }: { title: string }) => (
  <Heading style={header}>
    <Img src={TAPESTRY_URL} alt="Licorne" width="56" height="56" style={headerImg} />
    {title}
  </Heading>
)

export const BrandFooter = () => (
  <Text style={footerBar}>Élevage de Ragdolls • Le Domaine des Licornes</Text>
)

export const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }

export const container = {
  maxWidth: '600px',
  margin: '0 auto',
  border: '2px solid #0B1B3F',
  borderRadius: '8px',
  overflow: 'hidden',
}

export const content = { padding: '30px 25px' }

const header = {
  backgroundColor: '#0B1B3F',
  color: '#D4AF37',
  padding: '30px 20px',
  textAlign: 'center' as const,
  fontSize: '24px',
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

export const h2 = {
  fontSize: '20px',
  fontWeight: 'bold' as const,
  fontStyle: 'italic',
  color: '#0B1B3F',
  margin: '0 0 20px',
}

export const text = {
  fontSize: '14px',
  color: '#333333',
  lineHeight: '1.6',
  margin: '0 0 25px',
}

export const link = { color: '#B8912F', textDecoration: 'underline' }

export const button = {
  backgroundColor: '#0B1B3F',
  color: '#D4AF37',
  fontSize: '14px',
  fontWeight: 'bold' as const,
  border: '1px solid #D4AF37',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}

export const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#0B1B3F',
  backgroundColor: '#F5EFE0',
  border: '1px solid #D4AF37',
  borderRadius: '8px',
  padding: '12px 20px',
  textAlign: 'center' as const,
  letterSpacing: '4px',
  margin: '0 0 30px',
}

export const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }

const footerBar = {
  backgroundColor: '#0B1B3F',
  color: '#D4AF37',
  padding: '20px',
  textAlign: 'center' as const,
  fontSize: '13px',
  margin: 0,
}
