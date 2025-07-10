import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About - Blogzy</title>
        <meta name="description" content="Learn more about Blogzy, a modern blogging platform." />
      </Helmet>
      
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About Blogzy</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Blogzy is a modern blogging platform built with a focus on simplicity, performance, and user experience.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  At Blogzy, our mission is to provide a platform where writers, creators, and thinkers can share their ideas with the world. We believe in the power of words to inspire, educate, and connect people across the globe.
                </p>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  We're committed to building a platform that is not only easy to use but also powerful enough to meet the needs of both casual bloggers and professional writers. Our goal is to remove technical barriers and let you focus on what matters most: your content.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Our Story</h2>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  Blogzy was founded in 2023 by a team of passionate developers and writers who saw a need for a modern, user-friendly blogging platform. We were frustrated with the complexity of existing solutions and wanted to create something that was both powerful and simple to use.
                </p>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  What started as a small project has grown into a platform used by thousands of writers around the world. We're proud of what we've built and excited about the future of Blogzy.
                </p>
              </div>
            </div>
            
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-gray-900">Our Technology</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Blogzy is built with modern technologies to ensure a fast, reliable, and secure experience for our users. Our tech stack includes:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Frontend</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    React, Tailwind CSS, and modern JavaScript for a responsive and interactive user interface.
                  </p>
                </li>
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Backend</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Flask, SQLAlchemy, and PostgreSQL for a robust and scalable API and data layer.
                  </p>
                </li>
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Infrastructure</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Docker, Kubernetes, and cloud services for reliable and scalable hosting.
                  </p>
                </li>
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">DevOps</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    CI/CD pipelines, automated testing, and monitoring for continuous improvement.
                  </p>
                </li>
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Security</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    JWT authentication, HTTPS, and security best practices to protect your data.
                  </p>
                </li>
                <li className="rounded-md bg-gray-50 p-4">
                  <h3 className="text-base font-semibold text-gray-900">Performance</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Optimized code, caching, and CDN integration for fast page loads and a smooth experience.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-gray-900">Meet the Team</h2>
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-2xl font-semibold">
                    JD
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-600">Founder & CEO</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-2xl font-semibold">
                    JS
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">Jane Smith</h3>
                  <p className="text-sm text-gray-600">CTO</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-2xl font-semibold">
                    RJ
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-gray-900">Robert Johnson</h3>
                  <p className="text-sm text-gray-600">Lead Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;