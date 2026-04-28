/**
 * Tableau Public iframe embed (avoids injecting viz_v1.js per dashboard).
 * `viewPath` is workbook + sheet as on Tableau, e.g. MyWorkbook/Dashboard1
 */
export type TableauEmbedProps = {
  /** e.g. DeliveryPerformance_17773564982410/Dashboard1 */
  viewPath: string;
  title: string;
  /** Shown under the title; defaults to generic copy */
  blurb?: string;
};

function buildEmbedSrc(viewPath: string): string {
  const base = `https://public.tableau.com/views/${viewPath}`;
  return (
    base +
    '?:showVizHome=no' +
    '&:embed=yes' +
    '&:toolbar=yes' +
    '&:hidetabs=yes' +
    '&:language=en-US' +
    '&:display_count=yes'
  );
}

function buildOpenUrl(viewPath: string): string {
  return `https://public.tableau.com/views/${viewPath}`;
}

export function TableauEmbed({
  viewPath,
  title,
  blurb = 'Embedded from Tableau Public.',
}: TableauEmbedProps) {
  const embedSrc = buildEmbedSrc(viewPath);
  const openUrl = buildOpenUrl(viewPath);

  return (
    <section className="card overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          {blurb} If the frame does not load,{' '}
          <a
            href={openUrl}
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
          title={title}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
