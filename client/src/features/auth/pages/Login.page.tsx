// src/features/auth/pages/LoginPage.tsx
import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/LoginForm"; // ← use correct path
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  if (isLoading)
    return <div className="w-full h-full bg-black/10">Loading...</div>;

  return (
    <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <Button
        size="sm"
        variant="ghost"
        className="absolute left-6 top-6 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="w-4 h-4" />
        Go Back
      </Button>

      <div className="w-full max-w-sm md:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
