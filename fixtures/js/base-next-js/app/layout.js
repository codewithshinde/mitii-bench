export const metadata = {
  title: "Base Next",
  description: "mitii-bench base-next-js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Segoe UI, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
