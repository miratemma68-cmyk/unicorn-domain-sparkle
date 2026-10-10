/// <reference types="npm:@types/react@18.3.1" />

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
import {
  BrandFooter,
  BrandHeader,
  codeStyle,
  container,
  content,
  footer,
  h2,
  main,
  text,
} from './brand.tsx'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <BrandHeader title="Le Domaine des Licornes" />
        <Container style={content}>
          <Heading style={h2}>Confirm reauthentication</Heading>
          <Text style={text}>Use the code below to confirm your identity:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Text style={footer}>
            This code will expire shortly. If you didn't request this, you can
            safely ignore this email.
          </Text>
        </Container>
        <BrandFooter />
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail
