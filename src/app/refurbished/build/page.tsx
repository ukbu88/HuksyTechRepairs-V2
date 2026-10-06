import { gateRoute } from '@/routes/gate';
import { pageMetadata } from '@/seo/metadata';
import { listInventory } from '@/content/refurbished';
import { PageIntro } from '@/components/primitives/PageIntro';
import { Section } from '@/components/primitives/Section';
import { Builder } from '@/components/refurbished/Builder';

const PATH = '/refurbished/build';

export const metadata = pageMetadata({
  title: 'Build Your Refurb',
  description:
    'Choose from real available devices and the options each one supports. The build sheet updates as you go.',
  path: PATH,
});

export const dynamic = 'force-dynamic';

export default async function BuildPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  gateRoute(PATH);
  const params = await searchParams;
  const devices = listInventory().filter((d) => d.status === 'available');
  const requested = typeof params.sku === 'string' ? params.sku : undefined;
  const initialSku = devices.find((d) => d.sku === requested)?.sku ?? devices[0]?.sku ?? '';
  return (
    <>
      <PageIntro
        path={PATH}
        eyebrow="Refurbished · Build Your Refurb"
        title="Start from a real device. Choose what it supports."
        lead="The builder only offers combinations that exist: a specific unit, with the options that unit can take. The sheet on the right is exactly what you would be buying."
      />
      <Section>
        {devices.length ? (
          <Builder
            devices={devices}
            initialSku={initialSku}
            initial={{ privacyConfig: params.privacy === '1', charger: params.charger === '1' }}
          />
        ) : (
          <p className="lead">
            No devices are available to build from yet. The builder opens when real inventory
            exists.
          </p>
        )}
      </Section>
    </>
  );
}
