import "../assets/styles/footerWithoutNav.css"; // Import the CSS file for styling

const FooterWithoutNav = () => {
  return (
    <footer className="footer-without-nav">
      <div className="footer-content">
        <p>&copy; 2024 Unikloh. All Rights Reserved.</p>
        <div className="social-media">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterWithoutNav;
