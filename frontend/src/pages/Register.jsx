import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const success = await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Register - Blogzy</title>
        <meta name="description" content="Create a new Blogzy account" />
      </Helmet>
      
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <Formik
              initialValues={{
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <div className="mt-2">
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        className={`form-input ${
                          errors.username && touched.username ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <div className="mt-2">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`form-input ${
                          errors.email && touched.email ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        className={`form-input ${
                          errors.password && touched.password ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="mt-2">
                      <Field
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className={`form-input ${
                          errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="form-error"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm leading-6 text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="font-semibold text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary w-full"
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        'Sign up'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div>
              <div className="relative mt-10">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">Google</span>
                </a>

                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg className="h-5 w-5 fill-[#24292F]" aria-hidden="true" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;