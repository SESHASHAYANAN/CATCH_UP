export default function Search() {
  function search(formData) {
    const query = formData.get("query");
    alert(`You searched for '${query}'`);
  }
  return (
    <>
      <h3>formAction</h3>
      <form action={search}>
        <input name="query" />
        <button type="submit">Search</button>
      </form>
    </>
  );
}
