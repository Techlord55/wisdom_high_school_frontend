// ==================== src/app/(auth)/sign-in/[[...sign-in]]/page.jsx ====================
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <SignIn 
      routing="path" 
      path="/sign-in"
      afterSignInUrl="/complete-registration"
      afterSignUpUrl="/complete-registration"
    />
  );
}
