import React, { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import { ApplicationVerifier } from "firebase/auth";

export interface SignUpProps {
  name: string;
  email: string;
  city: string;
  phone: string;
  birth: Dayjs;
  appVerifier: ApplicationVerifier;
}
export default {}
