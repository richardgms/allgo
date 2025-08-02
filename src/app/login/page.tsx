import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}