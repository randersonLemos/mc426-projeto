import React, { FormEvent, useState } from 'react'
import { Button, CircularProgress, FormLabel, TextField } from '@mui/material'
import styles from './adminSignIn.module.css'
import { app } from '@/pages/_app'
import { useRouter } from 'next/router'
import BackendAdapter from '@/helpers/adpter/backendAdapter'

const adapter = new BackendAdapter("firebase", app)
adapter.backend?.auth.useDeviceLanguage()

export default function AdminSignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSignIn(ev: FormEvent) {
    ev.preventDefault()
    setLoading(true)

    await adapter.backend?.signInWithEmail(email, password, { shouldRedirect: true, redirect: () => router.push('/admin/campaignSelect') })

    setLoading(false)
  }

  return (
    <form className={styles.form} onSubmit={handleSignIn}>
      <FormLabel className={styles.label}>Email</FormLabel>
      <TextField label="Email" variant="filled" value={email} onChange={(ev) => setEmail(ev.target.value)} />
      <FormLabel className={styles.label}>Senha</FormLabel>
      <TextField
        label="Senha"
        variant="filled"
        type="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <Button variant="contained" color="primary" type="submit" onSubmit={handleSignIn} style={{ marginTop: '30px' }}>
        {loading ? <CircularProgress color="secondary" size={24} /> : 'Entrar'}
      </Button>
    </form>
  )
}
