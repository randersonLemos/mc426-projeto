import React, { FormEvent, useState } from "react";
import { Button, CircularProgress, FormLabel, TextField } from "@mui/material";
import styles from "./adminSignIn.module.css";
import { app } from "@/pages/_app";
import { useRouter } from "next/router";
import BackendAdapter from "@/helpers/adpter/backendAdapter";

const adapter = new BackendAdapter("firebase", app);

export default function AdminSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function ableToSignIn(email: string, password: string) {
    const passRegex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{8,100}$/;

    if (!email.includes("@") || !passRegex.test(password)) {
      console.log("unable to sign in");
      return false;
    }

    console.log("able to sign in");
    return true;
  }

  async function handleSignIn(ev: FormEvent) {
    ev.preventDefault();
    setLoading(true);

    if (ableToSignIn(email, password))
      await adapter.signInWithEmail(email, password);
    setLoading(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSignIn}>
      <FormLabel className={styles.label}>Email</FormLabel>
      <TextField
        label="Email"
        data-cy="email"
        variant="filled"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <FormLabel className={styles.label}>Senha</FormLabel>
      <TextField
        label="Senha"
        data-cy="password"
        variant="filled"
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button
        variant="contained"
        data-cy="submit"
        color="primary"
        type="submit"
        onSubmit={handleSignIn}
        style={{ marginTop: "30px" }}
      >
        {loading ? <CircularProgress color="secondary" size={24} /> : "Entrar"}
      </Button>
    </form>
  );
}
