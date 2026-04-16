import  { Outlet } from "react-router";
import { Navbar } from "./dashboard/nav-bar";
import { useAuthRedirect } from "~/api/auth";
import { FloatingMessaging } from "./dashboard/_components/floating-messaging";
import { FloatingNotifications } from "./dashboard/_components/floating-notification";


export default function customerPortalLayout() {
    const customer = useAuthRedirect();
    console.log("Customer Auth State in Layout:", customer); // Debug log to check auth state
    if (!customer) return null;
    return (
        <>
        <Navbar />
        <main className="pt-16 px-4 sm:px-6 lg:px-8">
            <Outlet />
        <FloatingNotifications />
        <FloatingMessaging />
        </main>
        </>
    )
}