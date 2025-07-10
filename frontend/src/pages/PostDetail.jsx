import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CommentSchema = Yup.object().shape({
  content: Yup.string()
    .required('Comment is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(500, 'Comment must be at most 500 characters'),
});

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  // Fetch post details
  const { data: postData, isLoading, error } = useQuery(
    ['post', slug],
    async () => {
      const response = await api.get(`/api/v1/posts/${slug}`);
      return response.data;
    }
  );
  
  // Add comment mutation
  const addCommentMutation = useMutation(
    (commentData) => api.post(`/api/v1/posts/${postData.post.id}/comments`, commentData),
    {
      onSuccess: () => {
        toast.success('Comment added successfully');
        queryClient.invalidateQueries(['post', slug]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to add comment');
      },
    }
  );
  
  // Delete post mutation
  const deletePostMutation = useMutation(
    () => api.delete(`/api/v1/posts/${postData.post.id}`),
    {
      onSuccess: () => {
        toast.success('Post deleted successfully');
        navigate('/');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to delete post');
      },
    }
  );
  
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      deletePostMutation.mutate();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading post. The post may have been deleted or does not exist.
              </p>
              <p className="mt-2">
                <Link to="/" className="text-red-700 font-medium underline">
                  Go back to home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const { post } = postData;
  const isAuthor = isAuthenticated && user?.id === post.author.id;
  
  return (
    <>
      <Helmet>
        <title>{post.title} - Blogzy</title>
        <meta name="description" content={post.content.substring(0, 160)} />
      </Helmet>
      
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          {/* Post header */}
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {post.title}
            </h1>
            
            <div className="mt-4 flex items-center justify-center gap-x-4 text-sm">
              <time dateTime={post.created_at} className="text-gray-500">
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </time>
              <div className="flex flex-wrap gap-1 justify-center">
                {post.tags?.map((tag) => (
                  <span
                    key={tag.id}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-x-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                  {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-3 text-sm leading-6">
                  <p className="font-semibold text-gray-900">
                    {post.author?.username || 'Anonymous'}
                  </p>
                </div>
              </div>
              
              {isAuthor && (
                <div className="flex space-x-2">
                  <Link
                    to={`/posts/edit/${post.id}`}
                    className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Featured image */}
          {post.image_url && (
            <div className="mt-10 relative">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          )}
          
          {/* Post content */}
          <div className="mt-10 prose prose-lg prose-primary mx-auto">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Comments section */}
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Comments ({post.comments?.length || 0})
            </h2>
            
            {/* Add comment form */}
            {isAuthenticated ? (
              <div className="mt-8">
                <Formik
                  initialValues={{ content: '' }}
                  validationSchema={CommentSchema}
                  onSubmit={(values, { resetForm }) => {
                    addCommentMutation.mutate(values);
                    resetForm();
                  }}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="content" className="form-label">
                          Add a comment
                        </label>
                        <div className="mt-1">
                          <Field
                            as="textarea"
                            id="content"
                            name="content"
                            rows={3}
                            className={`form-input ${
                              errors.content && touched.content ? 'border-red-500' : ''
                            }`}
                            placeholder="Share your thoughts..."
                          />
                          <ErrorMessage
                            name="content"
                            component="div"
                            className="form-error"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={addCommentMutation.isLoading}
                          className="btn btn-primary"
                        >
                          {addCommentMutation.isLoading ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            'Post Comment'
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div className="mt-8 bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  Please{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500">
                    sign in
                  </Link>{' '}
                  to leave a comment.
                </p>
              </div>
            )}
            
            {/* Comments list */}
            <div className="mt-8 space-y-8">
              {post.comments?.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-200 pb-8">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                        {comment.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {comment.author?.username || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-700">
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;