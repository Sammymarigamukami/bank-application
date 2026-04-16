import React, { useState } from "react"
import { useNavigate } from "react-router"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Loader2, Lock, User } from "lucide-react"

// Import the specific employee login function
import { loginEmployee } from "~/api/auth"

export default function AdminLoginForm() {
  const navigate = useNavigate()

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await loginEmployee({
        loginDetails: {
          userName: userName,
          password,
        }
      })
      console.log("Admin Login success:", data)
      navigate("/adminPortal")
    } catch (err: any) {
      console.error("Admin Login failed:", err)
      setError(err) 
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-none bg-transparent text-white shadow-none">
      <CardHeader className="pb-6">
        <CardTitle className="text-center text-lg font-bold uppercase tracking-widest text-zinc-100">
          Staff Authentication
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-center text-xs font-medium text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="admin-username" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Staff ID / Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />
              <Input
                id="admin-username"
                type="text"
                placeholder="Enter credentials"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Security Token / Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" />
              <Input
                id="admin-password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-700 focus:border-primary/50 focus:ring-0 transition-all"
              />
            </div>
          </div>

          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className="group relative h-12 w-full overflow-hidden bg-white text-zinc-950 hover:bg-zinc-200 transition-all"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Validating...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2 font-bold uppercase tracking-tighter">
                Access Terminal
              </span>
            )}
          </Button>
          
          <div className="pt-4 text-center">
            <p className="font-mono text-[10px] text-zinc-600">
              SECURE SESSION // IP LOGGING ENABLED
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}