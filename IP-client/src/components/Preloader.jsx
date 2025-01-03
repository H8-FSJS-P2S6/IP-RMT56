export default function Preloader() {
  return (
    <div id="preloader" style={{ display: "none" }}>
      <div className="loading">
        <lottie-player
          src="https://assets2.lottiefiles.com/packages/lf20_remmdtqv.json"
          background="transparent"
          speed={1}
          style={{ width: 300, height: 300 }}
          loop=""
          autoPlay=""
        />
      </div>
    </div>
  );
}
