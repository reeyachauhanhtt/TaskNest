import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

import useAuth from '../../hooks/Authentication';
import classes from './SignUpForm.module.css';
import AuthLayout from '../AuthLayout/AuthLayout';

export default function SignUpForm() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  const location = useLocation();
  const prefilledEmail = location.state?.email || '';

  function validate(name, value, allData) {
    if (!value) return 'Required';

    if (name === 'email') {
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email';
    }

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/;

    if (name === 'password') {
      if (!strongPassword.test(value)) {
        return 'Must include uppercase, lowercase, number, special character';
      }
    }

    if (name === 'confirmPassword') {
      if (value !== allData.password) {
        return 'Passwords do not match';
      }
    }

    return '';
  }

  function handleChange(e) {
    const form = e.target.form;
    const allData = Object.fromEntries(new FormData(form));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: validate(e.target.name, e.target.value, allData),
    }));
  }

  function handleBlur(e) {
    const form = e.target.form;
    const allData = Object.fromEntries(new FormData(form));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: validate(e.target.name, e.target.value, allData),
    }));
  }

  async function submitSignupHandler(e) {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    let newErrors = {};
    Object.keys(data).forEach((key) => {
      const err = validate(key, data[key], data);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerShake();
      return;
    }

    const result = await signup(data);

    if (!result.success) {
      setErrors({ [result.field]: result.message });
      toast.error(result.message);
      triggerShake();
      return;
    }

    toast.success('Account created successfully 🎉');
    navigate('/dashboard');
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  return (
    <AuthLayout title='Create Account' subtitle='Start your journey'>
      <motion.form
        className={classes.form}
        onSubmit={submitSignupHandler}
        animate={shake ? { x: [-6, 6, -6, 6, 0] } : {}}
      >
        <h2 className={classes.heading}>SIGN UP</h2>

        <div className={`${classes.field} ${classes.select}`}>
          <label>Role</label>
          <select name='role' defaultValue='member'>
            <option value='member'>Member</option>
            <option value='admin'>Admin</option>
          </select>
        </div>

        <div className={classes.field}>
          <label htmlFor='email'>Email</label>
          <input
            name='email'
            placeholder='Email'
            onBlur={handleBlur}
            defaultValue={prefilledEmail}
          />
          {errors.email && (
            <span className={classes.error}>{errors.email}</span>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor='firstName'>First Name</label>
          <input
            name='firstName'
            placeholder='First Name'
            onBlur={handleBlur}
          />
          {errors.firstName && (
            <span className={classes.error}>{errors.firstName}</span>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor='lastName'>Last Name</label>
          <input name='lastName' placeholder='Last Name' onBlur={handleBlur} />
          {errors.lastName && (
            <span className={classes.error}>{errors.lastName}</span>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor='username'>Username</label>
          <input name='username' placeholder='Username' onBlur={handleBlur} />
          {errors.username && (
            <span className={classes.error}>{errors.username}</span>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.password && (
            <span className={classes.error}>{errors.password}</span>
          )}
        </div>

        <div className={classes.field}>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            name='confirmPassword'
            type='password'
            placeholder='Confirm Password'
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span className={classes.error}>{errors.confirmPassword}</span>
          )}
        </div>

        <div className={classes.action}>
          <button type='submit'>Sign Up</button>
          <button type='button'>Cancel</button>
        </div>

        <p className={classes.account}>
          Already signed up?<Link to='/'>Login</Link>
        </p>
      </motion.form>
    </AuthLayout>
  );
}
