import React, { useState } from "react"
import { useNavigate } from "react-router"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { Loader2 } from "lucide-react" // Added for a better loading state

// Import the specific customer login function
import { loginCustomer } from "~/api/auth"

export default function CustomerLoginForm() {
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
      const data = await loginCustomer({
        loginDetails: {
          userName: userName,
          password,
        }
      })
      console.log("Customer Login success:", data)
      navigate("/customerPortal")
    } catch (err: any) {
      console.error("Customer Login failed:", err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    // Card: Removed bg-muted/30, used border-none because the wrapper now handles the glass effect
    <Card className="w-full border-none bg-transparent text-white shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-xl font-semibold text-white">
          Welcome Back
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-red-400 text-xs text-center font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customer-username" className="text-zinc-300 text-sm">
              Username
            </Label>
            <Input
              id="customer-username"
              type="text"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="customer-password" className="text-zinc-300 text-sm">
                Password
              </Label>
              <span className="text-xs text-primary hover:underline cursor-pointer">
                Forgot?
              </span>
            </div>
            <Input
              id="customer-password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
            />
          </div>

          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-zinc-500 text-sm">
              New to NexusBank?{" "}
              <button 
                type="button"
                className="text-primary font-medium hover:underline transition-all" 
                onClick={() => navigate("/RegisterAccount")}
              >
                Create an account
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}