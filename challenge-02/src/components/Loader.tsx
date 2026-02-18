const Loader = () => {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <div className="loader-text">Cargando...</div>
    </div>
  );
};

export default Loader;
