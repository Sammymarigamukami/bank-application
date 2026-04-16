import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router"
import { Toaster } from "sonner"

import type { Route } from "./+types/root"
import "./app.css"
import { DepositProvider } from "./components/userPortal/dashboard/context/depositContext"
import { DepositUI } from "./components/userPortal/dashboard/_components/mpesa-deposit"
import { RequestMoneyProvider } from "./components/userPortal/dashboard/context/requestContext"
import { RequestMoney } from "./components/userPortal/dashboard/_components/request-money"
import { PaybillProvider } from "./components/userPortal/dashboard/context/paybillContext"
import { Paybill } from "./components/userPortal/dashboard/_components/paybill"
import { SendMoneyProvider } from "./components/userPortal/dashboard/context/sendMoneyContext"
import { SendMoney } from "./components/userPortal/dashboard/_components/send-money"


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <DepositProvider>
        <RequestMoneyProvider >
        <PaybillProvider>
        <SendMoneyProvider>
        {children}
        <SendMoney />
        <Paybill />
        <RequestMoney />
        <DepositUI />
        </SendMoneyProvider>
        </PaybillProvider>
        </RequestMoneyProvider>
        </DepositProvider>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
