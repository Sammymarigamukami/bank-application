import React, { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Button } from "~/components/ui/button"
import { registerCustomer } from "~/api/auth"
import { useNavigate } from "react-router"
import { Loader2, UserPlus } from "lucide-react"



export default function RegisterForm() {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError]  = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const userData = {
      Username: username,
      Email: email,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      Phone: phone,
      role: "customer"
    }

    try {
      const data = await registerCustomer(userData);
      console.log("Registration success:", data)
      navigate("/customerPortal")
    } catch (error) {
      console.error("Registration failed failed:", error)
      setError("Registration failed. Please check your details and try again.")
    } finally {
      setLoading(false)
    }
  };

  return (
    <Card className="w-full border-none bg-transparent text-white shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-2xl font-bold text-white">
          Create Your Account
        </CardTitle>
        <p className="text-center text-sm text-zinc-400">
          Join NexusBank and manage your assets with ease.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 border border-red-500/20">
              <p className="text-red-400 text-xs text-center font-medium">{error}</p>
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-zinc-300 text-sm">First Name</Label>
              <Input
                id="firstname"
                type="text"
                placeholder="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-zinc-300 text-sm">Last Name</Label>
              <Input
                id="lastname"
                type="text"
                placeholder="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
          </div>

          {/* Username & Email Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-zinc-300 text-sm">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300 text-sm">Phone Number</Label>
              <Input
                id="phone"
                type="text"
                placeholder="+254..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              variant="default"
              disabled={loading}
              className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="size-5" />
                  Create Free Account
                </>
              )}
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-zinc-500 text-sm">
              Already have an account?{" "}
              <button 
                type="button"
                className="text-primary font-medium hover:underline transition-all" 
                onClick={() => navigate("/CustomerLogin")}
              >
                Sign In here
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}