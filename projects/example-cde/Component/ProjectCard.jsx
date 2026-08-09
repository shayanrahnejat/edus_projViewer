export function ProjectCard({ title, description, onOpen }) {
  return (
    <button className="project-card" onClick={onOpen}>
      <span className="project-card-kicker">CDE COMPONENT</span>
      <strong>{title}</strong>
      <p>{description}</p>
      <span className="project-card-action">Open project →</span>
    </button>
  );
}
