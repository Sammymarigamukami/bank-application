import  { Outlet } from "react-router";
import { AdminLayout } from "../_components/layouts/adminLayout";
import { Navbar } from "../_components/layouts/navbar";
import { useAuthRedirect, useEmployeeAuth } from "~/api/auth";



export default function customerPortalLayout() {
    const customer = useEmployeeAuth();
    console.log("Customer Auth State in Layout:", customer);
    if (!customer) return null;
    return (
        <>
        <Navbar />
        <main className="pt-16 px-4 sm:px-6 lg:px-8">
            <Outlet />
        </main>
        </>
    )
}