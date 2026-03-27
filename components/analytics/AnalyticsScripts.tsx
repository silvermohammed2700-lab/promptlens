import Script from "next/script";

interface AnalyticsScriptsProps {
  ga4Id?: string;
  clarityId?: string;
}

export function AnalyticsScripts({ ga4Id, clarityId }: AnalyticsScriptsProps) {
  const resolvedGa4 = ga4Id || process.env.NEXT_PUBLIC_GA4_ID || "G-1Z87YCC5TD";
  const resolvedClarity = clarityId ?? process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {resolvedGa4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${resolvedGa4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${resolvedGa4}', { page_path: window.location.pathname });
            `}
          </Script>
        </>
      )}
      {resolvedClarity && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${resolvedClarity}");
          `}
        </Script>
      )}
    </>
  );
}
