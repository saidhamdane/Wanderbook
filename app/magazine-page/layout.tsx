// Bare layout for puppeteer page renders — no chrome, white background
export default function MagazinePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`html,body{margin:0;padding:0;background:#fff!important;overflow:hidden!important}`}</style>
      {children}
    </>
  );
}
