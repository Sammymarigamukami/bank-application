import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { logout } from "~/api/auth";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";


export function UserDropdown({accountId, email, username}: {accountId: string, email: string, username: string}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

    const handleLogout = async () => {
        setLoading(true)
        setError(null)
        try {
        const data = await logout()
        console.log("Logout success:", data)
        navigate("/")
        } catch (error) {
        setError("Logout failed. Please try again.")
        } finally {
        setLoading(false)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                    <User className="mr-2 h-8 w-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-58">
                <DropdownMenuLabel className="flex min-w-0 flex-col space-x-2">
                    <p className="font-medium flex gap-2"><span>AccountID</span>{accountId}</p>
                    <p className="font-medium flex gap-2"><span>Username</span>{username}</p>
                    <p className="text-sm text-muted-foreground flex gap-2"><span>Email</span>{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link to="/customerPortal/settings">
                        <span>settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Button 
                    variant="default" 
                    className="w-full"
                    disabled={loading}
                    onClick={handleLogout}
                    >{loading ? "Logging out..." : "Logout"}</Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}