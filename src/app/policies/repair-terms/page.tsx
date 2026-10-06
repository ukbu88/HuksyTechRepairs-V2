import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { business } from '@/config/business';
import { POLICY_STATUS } from '@/content/policies';
import { Section } from '@/components/primitives/Section';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { DraftNotice } from '@/components/primitives/DraftNotice';

const PATH = '/policies/repair-terms';
const status = POLICY_STATUS.repairTerms;

export const metadata = {
  ...pageMetadata({
    title: 'Repair terms',
    description: `Quotes, approval, data and what happens if a device can't be repaired.`,
    path: PATH,
  }),
  robots: status.reviewed ? { index: true, follow: true } : { index: false, follow: true },
};

function Todo({ children }: { children: string }) {
  return (
    <p>
      <em>{children}</em>
    </p>
  );
}

export default function RepairTermsPage() {
  gateRoute(PATH);
  const entity = business.legalName ?? business.tradingName;
  return (
    <>
      <div className="container">
        <Breadcrumbs path={PATH} />
      </div>
      <Section>
        <p className="eyebrow">Policies</p>
        <h1>Repair terms</h1>
        {!status.reviewed ? <DraftNotice version={status.version} /> : null}
        <div className="prose">
          <p>
            These terms describe how {entity} ("Husky", "we") handles a repair from enquiry to
            return. They are written in plain English on purpose.
          </p>

          <h2>1. Opening a case</h2>
          <p>
            An enquiry opens a case under a HUS reference. It is not a commitment to repair: it is
            the start of a diagnosis. We may ask for more information before accepting a device.
          </p>

          <h2>2. Diagnosis</h2>
          <p>
            We diagnose before we quote. Diagnosis tells you what has failed and whether a repair is
            sensible; it does not guarantee that a repair is possible or economic.
          </p>
          {business.diagnosticFeePolicy ? (
            <p>{business.diagnosticFeePolicy}</p>
          ) : (
            <Todo>Diagnostic fee policy: to be confirmed by Husky.</Todo>
          )}

          <h2>3. Quotes and approval</h2>
          <p>
            After diagnosis you receive a plain-English explanation and your options. No repair work
            starts until you approve it.
          </p>
          {business.quoteApprovalRule ? (
            <p>{business.quoteApprovalRule}</p>
          ) : (
            <Todo>Quote validity and approval method: to be confirmed by Husky.</Todo>
          )}

          <h2>4. Parts</h2>
          <p>We tell you which category of part we intend to use before you approve a repair.</p>
          {business.partsCategories ? (
            <ul>
              {business.partsCategories.map((p) => (
                <li key={p.name}>
                  <strong>{p.name}.</strong> {p.definition}
                </li>
              ))}
            </ul>
          ) : (
            <Todo>Parts categories and their definitions: to be confirmed by Husky.</Todo>
          )}

          <h2>5. Your data</h2>
          <p>
            Back up your device before a repair where you can. We access only what the repair and
            testing require, and we tell you before any step that could affect your data.
            Board-level repairs on devices with soldered storage carry a risk to data that we will
            explain case by case.
          </p>
          {business.dataHandlingGuidance ? (
            <p>{business.dataHandlingGuidance}</p>
          ) : (
            <Todo>Data handling statement: to be confirmed by Husky.</Todo>
          )}

          <h2>6. Warranty</h2>
          {business.warrantyTerms ? (
            <p>{business.warrantyTerms}</p>
          ) : (
            <Todo>
              Warranty duration and exclusions by repair type: to be confirmed by Husky. Nothing on
              this site should be read as a warranty promise until this section is completed.
            </Todo>
          )}

          <h2>7. If it can't be repaired</h2>
          <p>
            If a device cannot be repaired, or a repair would not be sensible, we tell you with the
            reason and return the device in the state it arrived in, as far as the diagnosis allows.
            Some diagnostic steps (opening a sealed device, removing corroded components) cannot be
            reversed; we tell you before taking them where there is a choice.
          </p>

          <h2>8. Collection and uncollected devices</h2>
          <Todo>
            Collection window and what happens to uncollected devices: to be confirmed by Husky.
          </Todo>

          <h2>9. Liability</h2>
          <Todo>
            Liability wording requires Husky's review and, where appropriate, professional advice.
            Australian Consumer Law guarantees apply regardless of these terms.
          </Todo>

          <h2>10. Changes</h2>
          <p>The version and review status of these terms appear at the top of the page.</p>
        </div>
      </Section>
    </>
  );
}
