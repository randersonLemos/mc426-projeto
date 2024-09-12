import React, { FormEvent, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  Button,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IMaskInput } from "react-imask";
import { useRouter } from "next/router";
import { FirebaseWindow } from "@/helpers/customWindow";
import BackendAdapter from "@/helpers/adpter/backendAdapter";
import { app } from "@/pages/_app";
import dayjs, { Dayjs } from "dayjs";
import { ApplicationVerifier } from "firebase/auth";
import styles from "./signUpStyles.module.css";
import SignUpProps from "@/components/signUpProps/signUpProps";

const adapter = new BackendAdapter("firebase", app);

declare let window: FirebaseWindow;

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function TextMaskCustom(props, ref: any) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="(00) 90000-0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onChange={() => ""}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

export interface SignUpProps {
  name: string;
  email: string;
  city: string;
  phone: string;
  birth: Dayjs;
  appVerifier: ApplicationVerifier;
}

export default function SignUpForm() {
  const [values, setValues] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);
  const [birth, setBirth] = useState<Dayjs | null>(null);
  const [birthError, setBirthError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appVerifier, setAppVerifier] = useState<any>();
  const router = useRouter();

  function ableToLogin(phone: string) {
    if (!name || name.length < 3 || name.length > 20) setNameError(true);
    if (!email.includes("@")) setEmailError(true);
    if (!city || city.length < 3 || city.length > 45) setCityError(true);
    if (phone.length !== 14) setPhoneError(true);
    if (!birth?.isValid()) setBirthError(true);
    if (
      !birth?.isValid() ||
      birth?.diff(dayjs(), "seconds") >= 0 ||
      !email.includes("@") ||
      !city ||
      city.length < 3 ||
      city.length > 45 ||
      !name ||
      name.length < 3 ||
      name.length > 20 ||
      phone.length !== 14 // phone length considers the mask here
    ) {
      console.log("login failed");
      return false;
    }

    console.log("login successful");
    return true;
  }

  async function handleSignUp(ev?: FormEvent) {
    const phone = "+55" + values.replace(/[()-\s]/g, "");
    ev?.preventDefault();

    if (ableToLogin(phone) && birth)
      await signUp({ name, email, city, phone, birth, appVerifier });

    setLoading(false);
  }

  async function signUp(args: SignUpProps) {
    setLoading(true);
    await adapter.signInWithPhone(
      args,
      window
    );
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues(event.target.value);
  };

  React.useEffect(() => {
    window.recaptchaVerifier = adapter.validation();
    setAppVerifier(window.recaptchaVerifier);
  }, []);

  return (
    <form className={styles.form} onSubmit={handleSignUp}>
      <FormLabel className={styles.label}>Nome</FormLabel>
      <TextField
        className={styles.input}
        id="name"
        label="Nome"
        variant="filled"
        value={name}
        required
        data-cy="name"
        error={nameError}
        helperText={nameError ? "Nome deve ter entre 3 e 20 caracteres" : null}
        onChange={(ev) => {
          setName(ev.target.value);
          setNameError(false);
        }}
      />
      <FormLabel className={styles.label}>E-mail</FormLabel>
      <TextField
        className={styles.input}
        id="email"
        label="Email"
        variant="filled"
        value={email}
        type="email"
        data-cy="email"
        error={emailError}
        required
        onChange={(ev) => setEmail(ev.target.value)}
      />
      <FormLabel className={styles.label}>Cidade</FormLabel>
      <TextField
        className={styles.input}
        id="city"
        label="Cidade"
        variant="filled"
        value={city}
        data-cy="city"
        error={cityError}
        helperText={
          cityError ? "Cidade deve ter entre 3 e 45 caracteres" : null
        }
        required
        onChange={(ev) => setCity(ev.target.value)}
      />
      <FormLabel className={styles.label}>Telefone</FormLabel>
      <FormControl style={{ marginTop: "5px" }} variant="filled" required>
        <InputLabel htmlFor="phone">Telefone</InputLabel>
        <FilledInput
          id="phone"
          value={values}
          onChange={handleChange}
          data-cy="phone"
          error={phoneError}
          name="textmask"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          inputComponent={TextMaskCustom as any}
        />
      </FormControl>
      <FormLabel className={styles.label}>Data de Nascimento</FormLabel>
      <DatePicker
        className={styles.input}
        format="DD/MM/YYYY"
        value={birth}
        data-cy="birth"
        onChange={(newValue) => setBirth(newValue)}
        slotProps={{
          textField: {
            variant: "filled",
            label: "Data de Nascimento",
            id: "birth",
            error: birthError,
            required: true,
          },
        }}
      />
      <Button
        className={styles.button}
        data-cy="submit"
        color="primary"
        variant="contained"
        type="submit"
        onSubmit={handleSignUp}
      >
        {loading ? (
          <CircularProgress color="secondary" size={24} />
        ) : (
          "Cadastrar"
        )}
      </Button>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <div id="recaptcha"></div>
      </div>
    </form>
  );
}
