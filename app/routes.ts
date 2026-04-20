import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
    index("routes/_index.tsx"),
    route("RegisterAccount", "routes/RegisterAccount.tsx"),
    route("CustomerLogin", "routes/CustomerLogin.tsx"),
    route("EmployeeLogin", "routes/EmployeeLogin.tsx"),
    route("customerPortal", "components/userPortal/layout.tsx", [
        index("components/userPortal/user-home.tsx"),
        route("Accounts", "components/userPortal/account.tsx"),
        route("Analytics", "components/userPortal/analytics.tsx"),
        route("Cards", "components/userPortal/cards.tsx"),
        route("Payments", "components/userPortal/payments.tsx"),
        route("Transactions", "components/userPortal/transaction.tsx"),
        route("Transfer", "components/userPortal/transfer.tsx"),
        route("Settings", "components/userPortal/settings.tsx"),
        route("loan", "components/userPortal/loan.tsx"),
        route("fdAccount", "components/userPortal/fdAccount.tsx"),
    ]),
    route("adminPortal", "adminPortal/pages/layout.tsx", [
        index("adminPortal/pages/dashboard.tsx"),
        route("customers/:customerId", "adminPortal/pages/customer-profile.tsx"),
        route("loans/:id", "adminPortal/pages/loanDetailsPage.tsx"),
        route("loans", "adminPortal/pages/loan.tsx"),
        route("Settings", "adminPortal/pages/settings.tsx"),
        route("Transactions", "adminPortal/pages/transactions.tsx"),
        route("customers", "adminPortal/pages/customers.tsx"),
        route("Accounts", "adminPortal/pages/account.tsx"),
        route("Approvals", "adminPortal/pages/approvals.tsx"),
        route("Fraud", "adminPortal/pages/fraud.tsx"),
        route("Reports", "adminPortal/pages/report.tsx"),
    ])
] satisfies RouteConfig