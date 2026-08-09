export function HomePage() {
  const [visits, setVisits] = React.useState(ExampleStore.get('visits') || 0);

  React.useEffect(() => {
    const next = visits + 1;
    ExampleStore.set('visits', next);
    setVisits(next);
  }, []);

  return (
    <main className="example-shell">
      <div className="example-badge">EDUS compiler ready</div>
      <h1>Local CDE Project Viewer</h1>
      <p className="example-lead">Copy your project into the projects folder, rescan, and switch between compiled previews without opening EDUS Studio.</p>
      <div className="example-grid">
        <ProjectCard title="Canonical structure" description="App, Component, Core and Page folders are discovered automatically." onOpen={() => alert('This is a live CDE preview.')} />
        <ProjectCard title="Compiler parity" description="Imports are flattened, JSX is transformed, CSS is aggregated and exports are recovered." onOpen={() => alert(`Preview visit #${visits}`)} />
      </div>
      <footer>Preview visits stored locally: {visits}</footer>
    </main>
  );
}
