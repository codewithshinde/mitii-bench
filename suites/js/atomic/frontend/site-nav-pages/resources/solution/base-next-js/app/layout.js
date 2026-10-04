import { SiteChrome } from "../components/SiteChrome";

export const metadata = {
  title: "BenchApp",
  description: "mitii-bench site nav pages",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Segoe UI, system-ui, sans-serif" }}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
