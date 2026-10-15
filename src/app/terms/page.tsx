import type { Metadata } from "next";
import { LegalDocument, LegalSection } from "@/components/legal-document";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms for using the ${site.legalName} website.`,
};

export default function TermsPage() {
  return (
    <LegalDocument eyebrow="Legal" title="Terms of Service">
      <LegalSection title="Agreement">
        <p>
          These Terms of Service (“Terms”) govern your use of {site.url} and any
          related pages operated by {site.legalName} (“Fram Forge,” “we,” “us,”
          or “our”). By using this website, you agree to these Terms.
        </p>
        <p>
          If you do not agree, do not use the site. Our{" "}
          <a href="/privacy">Privacy Policy</a> explains how we handle
          information.
        </p>
      </LegalSection>

      <LegalSection title="The studio">
        <p>
          Fram Forge LLC designs and builds websites for businesses and offers
          ongoing support through monthly retainers. Your individual proposal
          defines the deliverables, timing, support limits, and project terms.
          Review and resolve any questions about that proposal before paying.
        </p>
      </LegalSection>

      <LegalSection title="Website payments and retainers">
        <p>
          Each custom offer lists a one-time website price and a recurring monthly
          retainer in U.S. dollars. The first payment includes both the website
          price and the first month of support. The retainer begins at checkout
          and renews monthly until canceled under your agreed proposal terms.
          Your final total is displayed before payment.
        </p>
        <p>
          Payments and subscriptions are processed by Stripe. Create an account
          with your assigned email and keep your sign-in credentials secure.
          Use My account to view your subscription, update payment details,
          or open Stripe’s cancellation confirmation. Cancellation timing
          is shown before you confirm. You can also contact us for help.
          Your proposal must specify cancellation, refund, and support terms;
          contact us before paying if those details are missing or unclear.
          A payment does not include work outside the agreed scope.
        </p>
      </LegalSection>

      <LegalSection title="Using the site">
        <p>You agree to use this website only for lawful purposes. You may not:</p>
        <ul>
          <li>Attempt to disrupt, probe, or reverse engineer the site</li>
          <li>Use the site to send spam, malware, or abusive messages</li>
          <li>Scrape or copy the site in a way that burdens our systems</li>
          <li>Misrepresent your identity when contacting us</li>
        </ul>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Fram Forge name, mark, text, layout, and other content on this
          site are owned by {site.legalName} or used with permission. You may
          view and share links to the site. You may not copy, modify, or
          commercially reuse our content without prior written permission,
          except as allowed by law (such as fair use).
        </p>
      </LegalSection>

      <LegalSection title="Apps and products">
        <p>
          Apps and other products mentioned on this site may be in development
          or not yet available. Descriptions, names, and timelines can change.
          Access to a specific app may be subject to additional terms, store
          rules, or a separate privacy notice when that product launches.
        </p>
      </LegalSection>

      <LegalSection title="Contact and submissions">
        <p>
          If you send us a message, idea, or other material, you grant Fram
          Forge a non-exclusive right to use it to operate the studio and
          respond to you. Unsolicited ideas are not treated as confidential. If
          you need confidentiality, do not send the idea until we have a written
          agreement in place.
        </p>
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          The site may link to third-party websites or services, including
          social platforms. We are not responsible for their content, terms, or
          privacy practices.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer">
        <p>
          This website is provided “as is” and “as available.” To the fullest
          extent permitted by law, we disclaim all warranties, express or
          implied, including merchantability, fitness for a particular purpose,
          and non-infringement. We do not warrant that the site will be
          uninterrupted, error-free, or secure.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {site.legalName} and its
          owners, members, and operators will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or for any
          loss of profits, data, or goodwill, arising out of your use of the
          site.
        </p>
        <p>
          Our total liability for any claim arising out of these Terms or the
          site will not exceed one hundred U.S. dollars ($100).
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these Terms from time to time. The “Last updated” date
          at the top of the page will change when we do. Continued use of the
          site after an update means you accept the revised Terms.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These Terms are governed by the laws of the United States and the
          state in which Fram Forge LLC is organized, without regard to
          conflict-of-law rules. Courts in that state will have exclusive
          jurisdiction over disputes, except where applicable law requires
          otherwise.
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
