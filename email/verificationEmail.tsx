import {
  Head,
  Heading,
  Html,
  Font,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface verificationEmailProps {
  username: string;
  otp: string;
}

export default function verificationEmail({
  username,
  otp,
}: verificationEmailProps) {
  return (
    <Html>
      <Head>
        <title>Verification Code</title>
        <Font fontFamily={"Roboto"} fallbackFontFamily={"Verdana"}
        fontStyle="normal"
        fontWeight={400}
        />
      </Head>
      <Preview>Here&apos;s your Verification code: {otp}</Preview>
      <Section>
        <Row>
            <Heading as={"h2"}>Hello {username},</Heading>
        </Row>
        <Row>
            <Text>Thank you for registering. Please use the following Verification code to complete your registration.</Text>
        </Row>
        <Row>
            <Text>{otp}</Text>
        </Row>
        <Row>
            <Text>If you did not request this code, please ignore this email.</Text>
       </Row>
       {/* <Row>
        <Button href={`http://localhost:3000/verify/${username}`}
        style={{color: "#61dafb"}}
        >
            Verify Here
        </Button>
       </Row> */}
      </Section>
    </Html>
  );
}
