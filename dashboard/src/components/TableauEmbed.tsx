/**
 * Tableau Public: EcommerceDeliveryDashboard / Dashboard1
 *
 * Uses the standard iframe embed instead of injecting viz_v1.js + <object>.
 * That avoids net::ERR_INSUFFICIENT_RESOURCES from repeated script loads
 * (e.g. React Strict Mode double-mount, fast refresh) and is lighter on connections.
 */
const TABLEAU_EMBED_SRC =
  'https://public.tableau.com/views/EcommerceDeliveryDashboard/Dashboard1' +
  '?:showVizHome=no' +
  '&:embed=yes' +
  '&:toolbar=yes' +
  '&:hidetabs=yes' +
  '&:language=en-US' +
  '&:display_count=yes';

const TABLEAU_OPEN_URL =
  'https://public.tableau.com/views/EcommerceDeliveryDashboard/Dashboard1';

export function TableauEmbed() {
  return (
    <section className="card overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">
          Tableau: Ecommerce Delivery Dashboard
        </h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Embedded from Tableau Public. If the frame does not load,{' '}
          <a
            href={TABLEAU_OPEN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-violet-600 hover:underline"
          >
            open the dashboard in a new tab
          </a>
          .
        </p>
      </div>
      <div className="relative h-[min(85vh,950px)] min-h-[520px] w-full bg-gray-50">
        <iframe
          title="Ecommerce Delivery Dashboard (Tableau)"
          src={TABLEAU_EMBED_SRC}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
