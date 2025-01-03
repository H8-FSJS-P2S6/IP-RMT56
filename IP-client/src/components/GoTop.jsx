import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import "../assets/styles/global.css";

const GoTop = () => {
  const [showGoTop, setShowGoTop] = useState(false);

  const handleVisibleButton = () => {
    setShowGoTop(window.pageYOffset > 50);
  };

  const handleScrollUp = () => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleVisibleButton);
  }, []);

  GoTop.propTypes = {
    showGoTop: PropTypes.func,
    scrollUp: PropTypes.func,
  };
  return (
    <div
      className={showGoTop ? "goTopVisible" : "goTopHidden"} // Toggle visibility using class names
      onClick={handleScrollUp}
    >
      <button type="button" className="goTop">
        <span className="material-symbols-outlined">expand_less</span>
      </button>
    </div>
  );
};

export default GoTop;
