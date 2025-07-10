import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'react-query';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const PostSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  content: Yup.string()
    .required('Content is required')
    .min(50, 'Content must be at least 50 characters'),
  tags: Yup.array()
    .min(1, 'Select at least one tag')
    .required('At least one tag is required'),
});

const CreatePost = () => {
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');
  const quillRef = useRef(null);
  
  // Fetch tags
  const { data: tagsData, isLoading: tagsLoading } = useQuery(
    'tags',
    async () => {
      const response = await api.get('/api/v1/tags');
      return response.data;
    }
  );
  
  // Create post mutation
  const createPostMutation = useMutation(
    (postData) => api.post('/api/v1/posts', postData),
    {
      onSuccess: (response) => {
        toast.success('Post created successfully');
        navigate(`/posts/${response.data.post.slug}`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create post');
      },
    }
  );
  
  // Create tag mutation
  const createTagMutation = useMutation(
    (tagData) => api.post('/api/v1/tags', tagData),
    {
      onSuccess: () => {
        toast.success('Tag created successfully');
        setNewTag('');
        // Refetch tags
        tagsQuery.refetch();
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to create tag');
      },
    }
  );
  
  const handleCreateTag = (e) => {
    e.preventDefault();
    if (newTag.trim().length < 2) {
      toast.error('Tag must be at least 2 characters');
      return;
    }
    createTagMutation.mutate({ name: newTag.trim() });
  };
  
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };
  
  return (
    <>
      <Helmet>
        <title>Create Post - Blogzy</title>
        <meta name="description" content="Create a new blog post on Blogzy" />
      </Helmet>
      
      <div className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Create a New Post
            </h1>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Share your thoughts, ideas, and stories with the world.
            </p>
            
            <div className="mt-10">
              <Formik
                initialValues={{
                  title: '',
                  content: '',
                  tags: [],
                  image_url: '',
                }}
                validationSchema={PostSchema}
                onSubmit={(values) => {
                  createPostMutation.mutate(values);
                }}
              >
                {({ errors, touched, setFieldValue, values }) => (
                  <Form className="space-y-8">
                    <div>
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <div className="mt-2">
                        <Field
                          id="title"
                          name="title"
                          type="text"
                          className={`form-input ${
                            errors.title && touched.title ? 'border-red-500' : ''
                          }`}
                          placeholder="Enter a catchy title"
                        />
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="form-error"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="image_url" className="form-label">
                        Featured Image URL (optional)
                      </label>
                      <div className="mt-2">
                        <Field
                          id="image_url"
                          name="image_url"
                          type="text"
                          className="form-input"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="form-label">
                        Content
                      </label>
                      <div className="mt-2">
                        <ReactQuill
                          ref={quillRef}
                          theme="snow"
                          value={values.content}
                          onChange={(content) => setFieldValue('content', content)}
                          modules={modules}
                          className={`${
                            errors.content && touched.content ? 'border-red-500' : ''
                          }`}
                          style={{ height: '300px', marginBottom: '50px' }}
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="form-error mt-2"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">Tags</label>
                      <div className="mt-2">
                        {tagsLoading ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {tagsData?.tags?.map((tag) => (
                              <label
                                key={tag.id}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
                                  values.tags.includes(tag.id)
                                    ? 'bg-primary-100 text-primary-800'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  value={tag.id}
                                  checked={values.tags.includes(tag.id)}
                                  onChange={(e) => {
                                    const tagId = parseInt(e.target.value);
                                    if (e.target.checked) {
                                      setFieldValue('tags', [...values.tags, tagId]);
                                    } else {
                                      setFieldValue(
                                        'tags',
                                        values.tags.filter((id) => id !== tagId)
                                      );
                                    }
                                  }}
                                />
                                {tag.name}
                              </label>
                            ))}
                          </div>
                        )}
                        <ErrorMessage
                          name="tags"
                          component="div"
                          className="form-error mt-2"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <label className="form-label">Create a new tag</label>
                        <div className="mt-2 flex">
                          <input
                            type="text"
                            className="form-input rounded-r-none"
                            placeholder="Enter new tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={handleCreateTag}
                            disabled={createTagMutation.isLoading}
                            className="btn btn-primary rounded-l-none"
                          >
                            {createTagMutation.isLoading ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              'Add Tag'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-8">
                      <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={createPostMutation.isLoading}
                        className="btn btn-primary"
                      >
                        {createPostMutation.isLoading ? (
                          <LoadingSpinner size="small" />
                        ) : (
                          'Publish Post'
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;