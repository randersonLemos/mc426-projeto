import React, { FormEvent, useState } from "react";
import styles from "./adminSignUp.module.css";
import { Button, CircularProgress, FormLabel, TextField } from "@mui/material";
import { app } from "@/pages/_app";
import { useRouter } from "next/router";
import BackendAdapter from "@/helpers/adpter/backendAdapter";

const adapter = new BackendAdapter("firebase", app);

export default function AdminSignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function ableToSignUp(
    email: string,
    password: string,
    cPassword: string,
    name: string
  ) {
    const passRegex =
      /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).{8,100}$/;

    if (
      name.length < 4 ||
      name.length > 20 ||
      !email.includes("@") ||
      !passRegex.test(password) ||
      password !== cPassword
    ) {
      console.log("unable to sign up");
      return false;
    }

    console.log("able to sign up");
    return true;
  }

  async function handleSignUp(ev: FormEvent) {
    ev.preventDefault();
    setLoading(true);

    if (ableToSignUp(email, password, cPassword, name))
      await adapter.signUp(
        email,
        password,
        "dashboard",
        name
      );

    await adapter.signUp(email, password, "/admin/campaignSelect", name)
    setLoading(false)
  }

  return (
    <form className={styles.form} onSubmit={handleSignUp}>
      <FormLabel className={styles.label}>Nome</FormLabel>
      <TextField
        required
        label="Nome"
        data-cy="name"
        variant="filled"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />
      <FormLabel className={styles.label}>Email</FormLabel>
      <TextField
        required
        label="Email"
        data-cy="email"
        type="email"
        variant="filled"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <FormLabel className={styles.label}>Senha</FormLabel>
      <TextField
        required
        label="Senha"
        data-cy="password"
        variant="filled"
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <FormLabel className={styles.label}>Confirmar senha</FormLabel>
      <TextField
        required
        label="Confirmar senha"
        data-cy="confirmPassword"
        variant="filled"
        type="password"
        value={cPassword}
        onChange={(ev) => setCPassword(ev.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        data-cy="submit"
        type="submit"
        onSubmit={handleSignUp}
        style={{ marginTop: "30px" }}
      >
        {loading ? (
          <CircularProgress color="secondary" size={24} />
        ) : (
          "Cadastrar-se"
        )}
      </Button>
    </form>
  );
}
