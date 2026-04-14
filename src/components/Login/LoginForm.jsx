import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import useAuth from '../../hooks/Authentication';
import { validatePassword, isPasswordValid } from '../../utils/validator';
import classes from './LoginForm.module.css';
import AuthLayout from '../AuthLayout/AuthLayout';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const rules = validatePassword(passwordValue);
  const isValidPassword = isPasswordValid(rules);

  const [emailValue, setEmailValue] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);

  useEffect(() => {
    if (!emailValue) return;

    const timer = setTimeout(async () => {
      setEmailChecking(true);

      try {
        const res = await fetch(
          `http://localhost:3000/users?email=${emailValue}`,
        );
        const data = await res.json();

        if (data.length === 0) {
          setErrors((prev) => ({
            ...prev,
            email: 'User not found',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: '',
          }));
        }
      } catch (err) {
        console.error(err);
      }

      setEmailChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [emailValue]);

  function validate(name, value) {
    let error = '';

    if (!value) error = 'Required';

    if (name === 'email' && value) {
      const valid = /\S+@\S+\.\S+/.test(value);
      if (!valid) error = 'Invalid email';
    }

    if (name === 'password' && value) {
      if (!isPasswordValid(validatePassword(value))) {
        error = 'Weak password';
      }
    }

    return error;
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));
  }

  function handlePasswordChange(e) {
    const value = e.target.value;
    setPasswordValue(value);

    setErrors((prev) => ({
      ...prev,
      password: validate('password', value),
    }));
  }

  async function submitLoginHandler(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
      email: form.email.value.trim(),
      password: form.password.value.trim(),
    };

    let newErrors = {};
    Object.keys(data).forEach((key) => {
      const err = validate(key, data[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    const result = await login(data);

    if (!result.success) {
      setErrors({ [result.field]: result.message });

      if (result.field === 'email') {
        toast.error('User not found. Create an account first.');
      } else {
        toast.error(result.message);
      }

      triggerShake();
      return;
    }

    toast.success(`Welcome back ${result.firstName} (${result.role})🎉😎`);
    navigate('/dashboard');
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  return (
    <AuthLayout title='Welcome Back' subtitle='Login to continue'>
      <motion.form
        className={classes.form}
        onSubmit={submitLoginHandler}
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
      >
        <h2 className={classes.heading}>LOGIN</h2>

        <p>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            placeholder='Email'
            onBlur={handleBlur}
            onChange={(e) => setEmailValue(e.target.value)}
          />
          {errors.email && (
            <span className={classes.error}>
              {errors.email}— create an account if you’re new
            </span>
          )}
        </p>

        <p>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            onBlur={handleBlur}
            onChange={handlePasswordChange}
          />

          {errors.password && (
            <span className={classes.error}>{errors.password}</span>
          )}

          {passwordValue && (
            <div className={classes.passwordRules}>
              <p className={rules.length ? classes.valid : classes.invalid}>
                • Min 6 characters
              </p>
              <p className={rules.uppercase ? classes.valid : classes.invalid}>
                • One uppercase
              </p>
              <p className={rules.lowercase ? classes.valid : classes.invalid}>
                • One lowercase
              </p>
              <p className={rules.number ? classes.valid : classes.invalid}>
                • One number
              </p>
              <p className={rules.special ? classes.valid : classes.invalid}>
                • One special character
              </p>
            </div>
          )}
        </p>

        <div className={classes.action}>
          <button type='submit' disabled={!isValidPassword}>
            Login
          </button>
          <button type='button'>Cancel</button>
        </div>

        <div>
          <p className={classes.account}>
            Not signed up? <Link to='/signup'>Create an account</Link>
          </p>
        </div>
      </motion.form>
    </AuthLayout>
  );
}
