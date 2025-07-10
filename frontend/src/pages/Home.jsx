import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  
  // Fetch posts
  const { data: postsData, isLoading: postsLoading, error: postsError } = useQuery(
    'posts',
    async () => {
      const response = await api.get('/api/v1/posts');
      return response.data;
    }
  );
  
  // Fetch tags
  const { data: tagsData } = useQuery(
    'tags',
    async () => {
      const response = await api.get('/api/v1/tags');
      return response.data;
    }
  );
  
  // Filter posts based on search term and selected tag
  const filteredPosts = postsData?.posts?.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = selectedTag === '' || 
      post.tags.some(tag => tag.name === selectedTag);
    
    return matchesSearch && matchesTag;
  });
  
  if (postsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (postsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading posts. Please try again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Blogzy - Modern Blogging Platform</title>
        <meta name="description" content="Discover interesting articles on Blogzy, a modern blogging platform." />
      </Helmet>
      
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blogzy</h1>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              A modern blogging platform for sharing your thoughts with the world.
            </p>
            
            {/* Search and filter */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="form-input"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {tagsData?.tags?.map((tag) => (
                  <option key={tag.id} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {filteredPosts?.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className="flex flex-col items-start">
                  <div className="relative w-full">
                    <div className="aspect-[16/9] w-full bg-gray-100 rounded-2xl overflow-hidden">
                      <img
                        src={post.image_url || 'https://via.placeholder.com/800x450?text=Blogzy'}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
                  </div>
                  <div className="max-w-xl">
                    <div className="mt-8 flex items-center gap-x-4 text-xs">
                      <time dateTime={post.created_at} className="text-gray-500">
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </time>
                      <div className="flex flex-wrap gap-1">
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
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link to={`/posts/${post.slug}`}>
                          <span className="absolute inset-0"></span>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <div className="relative mt-8 flex items-center gap-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold">
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <span className="absolute inset-0"></span>
                          {post.author?.username || 'Anonymous'}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No posts found. Try a different search term or tag.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;