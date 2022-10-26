
function Pill(props) {
  return (
    <a href={props.link}>
      <div className="nav-item" id={props.name}>
        <span>{props.name}</span>
      </div>
    </a>
  )
}

export default Pill;