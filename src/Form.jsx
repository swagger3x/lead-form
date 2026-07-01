import { useState } from 'react'
import './Form.css'

// const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxrWLN8aTBGZk3gaZ5KXvTTzeNQQ9iXFBzy5-ImdxpMHTw_6TeRvwmPF_x_mNIMZi57/exec'
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxNNMYQ9qbwgBNRw-E4meyVeovvpkexdoD3RZrcYXWYhTaSyFneOIxvI8n0Y5lknCO0/exec'

const validate = ({ fname, lname, email, phone, company }) => {
  const errs = {}
  if (!fname.trim()) errs.fname = 'First name is required'
  if (!lname.trim()) errs.lname = 'Last name is required'
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
//   if (!/^[\+\d\s\(\)\-]{7,20}$/.test(phone)) errs.phone = 'Enter a valid phone number'
  if (!company.trim()) errs.company = 'Company is required'
  return errs
}

export default function Form() {
  const [fields, setFields] = useState({
    fname: '', lname: '', company: '', message: ''
  })
  const [errors, setErrors] = useState({})
  const [human, setHuman] = useState(false)
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success

  const set = (key) => (e) => {
    setFields(f => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors(er => ({ ...er, [key]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (honey) return
    if (!human) { alert("Please confirm you're not a robot."); return }

    const errs = validate(fields)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${fields.fname} ${fields.lname}`,
        //   phone: fields.phone,
        //   email: fields.email,
          company: fields.company,
          message: fields.message || '—'
        })
      })
      setStatus('success')
    } catch {
      alert('Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const reset = () => {
    setFields({ fname: '', lname: '', email: '', phone: '', company: '', message: '' })
    setErrors({})
    setHuman(false)
    setStatus('idle')
  }

  if (status === 'success') return (
    <div className="card success">
      <div className="check">✓</div>
      <h2>Message sent!</h2>
      <p>Thanks for reaching out. We'll be in touch soon.</p>
      <button onClick={reset} className="link-btn">Submit another response</button>
    </div>
  )

  return (
    <div className="card">
      <div className="header">
        <h1>Get in touch</h1>
        <p>Fill in your details and we'll get back to you.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          <Field label="First name" id="fname" placeholder="Alex"
            value={fields.fname} onChange={set('fname')} error={errors.fname} />
          <Field label="Last name" id="lname" placeholder="Johnson"
            value={fields.lname} onChange={set('lname')} error={errors.lname} />
        </div>

        {/* <Field label="Email" id="email" type="email" placeholder="alex@company.com"
          value={fields.email} onChange={set('email')} error={errors.email} />

        <Field label="Phone" id="phone" type="tel" placeholder="+1 (555) 000-0000"
          value={fields.phone} onChange={set('phone')} error={errors.phone} /> */}

        <Field label="Company" id="company" placeholder="Acme Inc."
          value={fields.company} onChange={set('company')} error={errors.company} />

        <div className="field">
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Tell us what you're looking for..."
            value={fields.message} onChange={set('message')} rows={4} />
        </div>

        <input type="text" className="honey" tabIndex={-1} autoComplete="off"
          value={honey} onChange={e => setHoney(e.target.value)} />

        <div className="checkbox-row">
          <input type="checkbox" id="human" checked={human}
            onChange={e => setHuman(e.target.checked)} />
          <label htmlFor="human">I'm not a robot</label>
        </div>

        <button type="submit" className="submit-btn" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}

function Field({ label, id, type = 'text', placeholder, value, onChange, error }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        className={error ? 'error' : ''} />
      {error && <span className="err-msg">{error}</span>}
    </div>
  )
}