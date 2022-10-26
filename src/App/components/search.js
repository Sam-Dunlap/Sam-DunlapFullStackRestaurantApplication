export default function Searchbar(props) {
  return (
    <div className='nav-search'>
      <input type='text' placeholder='what sounds good?' onChange={props.search}></input>
    </div>
  )
}