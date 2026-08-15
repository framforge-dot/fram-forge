import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal-document";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.legalName} collects, uses, and protects information.`,
};

export default function PrivacyPage() {
  return (
    <LegalDocument eyebrow="Legal" title="Privacy Policy">
      <LegalSection title="Overview">
        <p>
          This Privacy Policy explains how {site.legalName} (“Fram Forge,” “we,”
          “us,” or “our”) handles information when you visit {site.url}, contact
          us, or otherwise use this website.
        </p>
        <p>
          This page covers the Fram Forge website. Individual apps we release
          later may have their own privacy notices. If those notices differ from
          this policy, the notice for that app will control for that product.
        </p>
      </LegalSection>

      <LegalSection title="Who we are">
        <p>
          Fram Forge LLC is an independent app studio. We design, build, launch,
          and operate our own apps and digital products.
        </p>
        <p>
          Questions about privacy can be sent to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </LegalSection>

      <LegalSection title="Information we collect">
        <p>We may collect the following categories of information:</p>
        <ul>
          <li>
            <strong className="text-paper">Information you send us.</strong> If
            you contact us by email or through the form on this site, we receive
            your name, email address, and the content of your message.
          </li>
          <li>
            <strong className="text-paper">Technical information.</strong> Like
            most websites, our hosting provider may automatically receive data
            such as IP address, browser type, device type, referring URL, pages
            viewed, and timestamps. This is used to operate, secure, and
            diagnose the site.
          </li>
        </ul>
        <p>
          We do not currently require an account to use this website, and we do
          not ask for payment information here.
        </p>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>We use information to:</p>
        <ul>
          <li>Respond to inquiries and operate the studio</li>
          <li>Host, maintain, and improve this website</li>
          <li>Protect against abuse, spam, and security incidents</li>
          <li>Comply with law and enforce our terms</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection title="How we share information">
        <p>
          We share information only when needed to run the studio, including:
        </p>
        <ul>
          <li>
            <strong className="text-paper">Service providers.</strong> This
            website may be hosted by Vercel or a similar provider that processes
            technical data to deliver the site.
          </li>
          <li>
            <strong className="text-paper">Legal reasons.</strong> We may
            disclose information if required by law, regulation, legal process,
            or to protect the rights, safety, or property of Fram Forge or
            others.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies and analytics">
        <p>
          We do not currently use advertising cookies or third-party analytics
          on this website. If that changes, we will update this policy.
        </p>
        <p>
          The site may still use strictly necessary cookies or similar
          technologies required to host and secure the page.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep contact messages and related records for as long as needed to
          respond, run the studio, and meet legal obligations, then delete or
          de-identify them when they are no longer needed.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We take reasonable administrative and technical measures to protect
          information. No method of transmission or storage is completely
          secure, so we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          This website is not directed at children under 13, and we do not
          knowingly collect personal information from them. If you believe a
          child has provided us information, contact us and we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You can choose not to contact us. If you have already sent a message
          and want us to delete it, email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and we will honor
          the request unless we must keep the record for legal or security
          reasons.
        </p>
      </LegalSection>

      <LegalSection title="International visitors">
        <p>
          We are based in the United States. If you visit from another country,
          your information may be processed in the United States, where privacy
          laws may differ from those in your location.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy from time to time. The “Last updated” date
          at the top of the page will change when we do. Continued use of the
          site after an update means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Fram Forge LLC
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
