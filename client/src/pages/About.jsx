const About = () => {
  return (
    <>
      <div className="flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center">
        <h2 className="text-4xl font-bold leading-none tracking-tight sm:text-4xl">
          Technologies powering
        </h2>
        <div className="stats bg-primary shadow">
          <div className="stat">
            <div className="stat-title text-primary-content text-2xl font-bold tracking-wide">
              our site
            </div>
          </div>
        </div>
      </div>
      <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
        Welcome to Biush, our e-commerce platform, built with the MERN stack and
        a lil help from Tailwind and daisyUI to bring clients a seamless
        shopping experience. User authentication is a critical component in our
        platform, ensuring that each user's experience is personalized, secure,
        and smooth. Here's how we've approached it:
      </p>
      <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
        <li>
          Passwords are hashed using bcrypt before storage to prevent plain text
          exposure.
        </li>
        <li>
          JWTs are stored in local storage or cookies, depending on security
          settings, with expiration times to manage session durations.
        </li>
        <li>
          Beyond authentication, we've implemented role-based access control,
          allowing different user roles (like "admin", "customer") to access
          specific functionalities or data.
        </li>
        <li>
          Finally, Users can reset their passwords through a secure email-based
          process, ensuring recovery without compromising security.
        </li>
        This thorough authentication system not only protects user data but also
        enriches the user experience by providing a secure, trusted environment
        for shopping, managing personal information, and interacting with our
        platform.
      </p>
      <p className="mt-6 text-lg leading-8 max-w-2xl mx-auto">
        Another cool feature we’ve built into this site is data caching using
        React Query and React Router, It makes the site faster and reduces load
        on our server, saving resources while keeping your experience seamless.
      </p>
    </>
  );
};

export default About;
