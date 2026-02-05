import './globals.css'

export const metadata = {
  title: 'Linked List Visual Debugger',
  description: 'Visual Debugger for the Linked List Family using Real-Time Memory Simulation and C++ Algorithms',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
