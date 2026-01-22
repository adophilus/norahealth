// @ts-nocheck
// biome-ignore lint/correctness/noUnusedImports: This react import is required for the proper operation of this jsx component
import React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "jsx-email";
import { Effect } from "effect";
import { AppConfig } from "@/features/config";

export type SignInVerificationMailProps = {
  otp: string;
};

const main = {
  backgroundColor: "#F9FAFB",
  fontFamily: "Roboto",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "30px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  width: "360px",
  margin: "0 auto",
  padding: "68px 0 130px",
  position: "relative" as const,
  zIndex: "10",
  background:
    "url('https://res.cloudinary.com/djxs8mu07/image/upload/v1768514657/blob-scene-haikei_1_fnagxf.svg')",
  backgroundSize: "cover",
};

const logo = {
  width: "70px",
  height: "70px",
  borderRadius: "12px",
  margin: "0 auto",
};

const tertiary = {
  color: "#black",
  marginBottom: "25px",
  fontFamily: "Roboto",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  fontWeight: "400",
  fontSize: "20px",
  margin: "16px 8px 8px 8px",
  textTransform: "captialize" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "Roboto",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "8px",
  margin: "16px auto 14px",
  verticalAlign: "middle",

  width: "280px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontFamily: "Roboto",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "Roboto",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

export const SignInVerificationMail = Effect.fn(function* ({
  otp,
}: SignInVerificationMailProps) {
  const config = yield* AppConfig;

  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Body style={main}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            opacity: 0.1,
            pointerEvents: "none",
            backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            height: "100%",
          }}
        ></div>
        <Container style={container}>
          <Img
            src="https://res.cloudinary.com/djxs8mu07/image/upload/v1768421755/logo_q4fyjb.webp"
            width="212"
            height="88"
            alt="nora-health"
            style={logo}
          />

          <Text style={tertiary}>Verify Your Identity</Text>
          <Heading style={secondary}>
            Enter the following code <br /> to verify your account.
          </Heading>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={paragraph}>Not expecting this email?</Text>
          <Text style={paragraph}>
            Contact{" "}
            <Link href={`mailto:team@nora-health.xyz`} style={link}>
              team@nora-health.xyz
            </Link>{" "}
            if you did not request this code.
          </Text>
        </Container>
      </Body>
    </Html>
  );
});
