import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  bio: Yup.string()
    .max(500, 'Bio must be at most 500 characters'),
  website: Yup.string()
    .url('Invalid URL')
    .nullable(),
});

const PasswordSchema = Yup.object().shape({
  current_password: Yup.string()
    .required('Current password is required'),
  new_password: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();
  
  // Fetch user posts
  const { data: postsData, isLoading: postsLoading } = useQuery(
    'userPosts',
    async () => {
      const response = await api.get('/api/v1/users/posts');
      return response.data;
    }
  );
  
  // Delete post mutation
  const deletePostMutation = useMutation(
    (postId) => api.delete(`/api/v1/posts/${postId}`),
    {
      onSuccess: () => {
        toast.success('Post deleted successfully');
        queryClient.invalidateQueries('userPosts');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete post');
      },
    }
  );
  
  const handleDeletePost = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePostMutation.mutate(postId);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Profile - Blogzy</title>
        <meta name="description" content="Manage your Blogzy profile" />
      </Helmet>
      
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Profile
            </h1>
            
            <div className="mt-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`${
                    activeTab === 'password'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Change Password
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`${
                    activeTab === 'posts'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
                >
                  Your Posts
                </button>
              </nav>
            </div>
            
            <div className="mt-10">
              {activeTab === 'profile' && (
                <Formik
                  initialValues={{
                    username: user?.username || '',
                    email: user?.email || '',
                    bio: user?.bio || '',
                    website: user?.website || '',
                  }}
                  validationSchema={ProfileSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    try {
                      await updateProfile(values);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
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
                          Email
                        </label>
                        <div className="mt-2">
                          <Field
                            id="email"
                            name="email"
                            type="email"
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
                        <label htmlFor="bio" className="form-label">
                          Bio
                        </label>
                        <div className="mt-2">
                          <Field
                            as="textarea"
                            id="bio"
                            name="bio"
                            rows={4}
                            className={`form-input ${
                              errors.bio && touched.bio ? 'border-red-500' : ''
                            }`}
                            placeholder="Tell us about yourself"
                          />
                          <ErrorMessage
                            name="bio"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="website" className="form-label">
                          Website
                        </label>
                        <div className="mt-2">
                          <Field
                            id="website"
                            name="website"
                            type="text"
                            className={`form-input ${
                              errors.website && touched.website ? 'border-red-500' : ''
                            }`}
                            placeholder="https://example.com"
                          />
                          <ErrorMessage
                            name="website"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary"
                        >
                          {isSubmitting ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              
              {activeTab === 'password' && (
                <Formik
                  initialValues={{
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                  }}
                  validationSchema={PasswordSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    try {
                      const success = await changePassword({
                        current_password: values.current_password,
                        new_password: values.new_password,
                      });
                      if (success) {
                        resetForm();
                      }
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
                      <div>
                        <label htmlFor="current_password" className="form-label">
                          Current Password
                        </label>
                        <div className="mt-2">
                          <Field
                            id="current_password"
                            name="current_password"
                            type="password"
                            className={`form-input ${
                              errors.current_password && touched.current_password ? 'border-red-500' : ''
                            }`}
                          />
                          <ErrorMessage
                            name="current_password"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="new_password" className="form-label">
                          New Password
                        </label>
                        <div className="mt-2">
                          <Field
                            id="new_password"
                            name="new_password"
                            type="password"
                            className={`form-input ${
                              errors.new_password && touched.new_password ? 'border-red-500' : ''
                            }`}
                          />
                          <ErrorMessage
                            name="new_password"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="confirm_password" className="form-label">
                          Confirm New Password
                        </label>
                        <div className="mt-2">
                          <Field
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            className={`form-input ${
                              errors.confirm_password && touched.confirm_password ? 'border-red-500' : ''
                            }`}
                          />
                          <ErrorMessage
                            name="confirm_password"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="btn btn-primary"
                        >
                          {isSubmitting ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            'Change Password'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              
              {activeTab === 'posts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Your Posts
                    </h2>
                    <a
                      href="/posts/create"
                      className="btn btn-primary"
                    >
                      Create New Post
                    </a>
                  </div>
                  
                  {postsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="large" />
                    </div>
                  ) : postsData?.posts?.length > 0 ? (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                              Title
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Date
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                              Status
                            </th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {postsData.posts.map((post) => (
                            <tr key={post.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {post.title}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                  Published
                                </span>
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                  <a
                                    href={`/posts/${post.slug}`}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    View
                                  </a>
                                  <a
                                    href={`/posts/edit/${post.id}`}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    Edit
                                  </a>
                                  <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
                      <a
                        href="/posts/create"
                        className="btn btn-primary"
                      >
                        Create Your First Post
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;