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
  Text,
} from "jsx-email";
import { Effect } from "effect";
import { AppConfig } from "@/features/config";

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  width: "360px",
  margin: "0 auto",
  padding: "68px 0 130px",
};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#2a9b7d",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
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

export const WelcomeMail = Effect.fn(function* () {
  const config = yield* AppConfig;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://via.placeholder.com/512"
            width="212"
            height="88"
            alt="logo"
            style={logo}
          />
          <Text style={tertiary}>Welcome to nora-health!</Text>
          <Heading style={secondary}>
            Hey friend 👋, Welcome to nora-health!
          </Heading>
          <Text style={paragraph}>
            We're excited to have you on board. Start exploring delicious meals
            from various kitchens.
          </Text>
          <Text style={paragraph}>
            If you have any questions, feel free to contact us.
          </Text>
          <Text style={paragraph}>
            Contact{" "}
            <Link href={`mailto:team@nora-health.xyz`} style={link}>
              team@nora-health.xyz
            </Link>{" "}
            for support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
});
