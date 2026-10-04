export const metadata = {
  title: "Portal Tooltip",
  description: "mitii-bench",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Segoe UI, system-ui, sans-serif" }}>
        {children}
        <div id="modal-root" />
      </body>
    </html>
  );
}
