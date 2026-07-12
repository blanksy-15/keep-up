import { AuthForm } from "@/components/auth/auth-form";
export default function SignUpPage(){return <main className="auth-page"><AuthForm mode="sign-up" registrationAllowed={process.env.ALLOW_PUBLIC_SIGN_UP==="true"}/></main>;}
