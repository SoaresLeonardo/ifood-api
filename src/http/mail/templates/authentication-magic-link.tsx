import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface AuthenticationMagicLinkTemplateProps {
  userEmail: string;
  userName: string;
  authLink: string;
}

export function AuthenticationMagicLinkTemplate({
  userEmail,
  userName,
  authLink,
}: AuthenticationMagicLinkTemplateProps) {
  const previewText = `Faça login na Burger`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Entre na Burger
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              <strong>{userName}</strong> (
              <Link
                href={`mailto:${userEmail}`}
                className="text-blue-600 no-underline"
              >
                {userEmail}
              </Link>
              ) confirme seu e-mail para entrar em sua conta.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={authLink}
              >
                Confirmar
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Ou copie a URL em seu navegador:
              <Link href={authLink} className="text-blue-600 no-underline">
                {authLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
