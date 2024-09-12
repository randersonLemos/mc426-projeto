import { FirebaseApp } from "firebase/app";
import BackendFirebase from "./backendFirebase";
import { FirebaseWindow } from "@/helpers/customWindow";
import { ApplicationVerifier } from "firebase/auth";
import { SignUpProps } from "@/components/signUpProps/signUpProps";
import { useRouter } from "next/router";

class BackendAdapter {
    backend: BackendFirebase | null = null

    constructor(backendType: string, app: FirebaseApp) {
        if (backendType === "firebase") {
            this.backend = new BackendFirebase(app)
            this.backend?.auth.useDeviceLanguage();
        }
        else {
            throw new Error('Suporta apenas firebase')
        }
    }
    
    signInWithPhone(args: SignUpProps, window: FirebaseWindow) {
      this.backend?.signInWithPhone(
        args,
        { shouldRedirect: true, redirect: () => useRouter().push("/verify") },
        window
      );
    }
    
    signInWithEmail(email: string, password: string) {
      this.backend?.signInWithEmail(email, password, {
        shouldRedirect: true,
        redirect: () => useRouter().push("/admin/campaignSelect"),
      });
    }

    validation() {
      return this.backend?.validation();
    }
    
    signUp(email: string, password: string, path: string, name: string) {
      this.backend?.signUp(
        email,
        password,
        { shouldRedirect: true, redirect: () => useRouter().push(path) },
        name
      );
    }
}

export default BackendAdapter
