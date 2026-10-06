import Link from 'next/link';
import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { POLICY_STATUS } from '@/content/policies';
import { Section } from '@/components/primitives/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { DraftNotice } from '@/components/primitives/DraftNotice';

const PATH = '/policies/privacy';
const status = POLICY_STATUS.privacy;

export const metadata = {
  ...pageMetadata({
    title: 'Privacy policy',
    description: `How ${business.tradingName} handles the information you give us.`,
    path: PATH,
  }),
  robots: status.reviewed ? { index: true, follow: true } : { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  gateRoute(PATH);
  const entity = business.legalName ?? business.tradingName;
  return (
    <>
      <div className="container">
        <Breadcrumbs path={PATH} />
      </div>
      <Section>
        <p className="eyebrow">Policies</p>
        <h1>Privacy policy</h1>
        {!status.reviewed ? <DraftNotice version={status.version} /> : null}
        <div className="prose">
          <p>
            This policy explains what {entity} ("Husky", "we") collects through this website, why,
            and what we do with it. It is written to be read, not skimmed.
          </p>

          <h2>What we collect, and why</h2>
          <p>
            <strong>Repair enquiries.</strong> When you start a repair, we ask what the device is,
            what is wrong with it, whether anyone has tried to repair it, how it might reach us, and
            your name, email address and (optionally) phone number. We collect this to assess the
            repair, reply to you, and manage the case under its HUS reference. We do not ask for
            passwords or passcodes in the form; if testing a device requires one, we ask you
            directly and you can decline.
          </p>
          <p>
            <strong>Technical information.</strong> When you submit an enquiry we record the time,
            the page it came from and the browser identification string, to detect abuse of the
            form. We do not run analytics or advertising trackers on this site.
          </p>

          <h2>Cookies</h2>
          <p>
            The enquiry form sets two short-lived cookies, used only to carry you from the form to
            the confirmation page and to keep what you typed if something goes wrong. They expire
            within an hour and are not used for tracking. There are no third-party cookies.
          </p>

          <h2>Where your information is stored</h2>
          <p>
            Enquiries are stored in a database hosted by Neon (Postgres) and the website runs on
            Vercel. A notification email about each new enquiry is sent to Husky through Resend.
            Each of those providers processes the data under its own terms; we use them only to run
            this site and manage repairs.
          </p>

          <h2>Who sees it</h2>
          <p>
            Husky. We do not sell or share enquiry information with anyone else, except where a
            repair requires it (for example, a courier label if you choose mail-in once that is
            offered) or where the law requires it.
          </p>

          <h2>How long we keep it</h2>
          <p>
            Case records are kept so that we can support you after a repair and answer questions
            about it later.
            {/* TODO(Prince): confirm a retention period and the deletion process. */}
            The exact retention period is still to be confirmed by Husky and will be stated here.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask to see, correct or delete the information we hold about you.{' '}
            {business.publicEmail ? (
              <>
                Email <a href={`mailto:${business.publicEmail}`}>{business.publicEmail}</a>.
              </>
            ) : (
              'A contact address for privacy requests will be published here once confirmed; in the meantime, reply to any email from us about your case.'
            )}
          </p>

          <h2>Devices and the data on them</h2>
          <p>
            A device you send in may contain personal data. We access only what a repair and its
            testing require. Back up before a repair where you can; see{' '}
            <Link href="/policies/repair-terms">repair terms</Link> for how data is handled during
            repair.
          </p>

          <h2>Changes</h2>
          <p>
            This policy will change when the business's practices change. The version and review
            status appear at the top of the page.
          </p>
        </div>
      </Section>
    </>
  );
}
