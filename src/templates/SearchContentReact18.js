import { useTransition, useState } from "react";

import { fetcher } from "./fetcher";
export function SearchContentUseTransition({}) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = async () => {
    // fiber 低优先级更新用 startTransition 包裹
    // https://react.dev/reference/react/useTransition
    startTransition(async () => {
      const { title, id } = await fetcher(name);
      setTitle(title);
      setId(id);
      if (!title) {
        setError(true);
      } else {
        setError(false);
      }
    });
  };

  return (
    <div>
      <h3>Search Content using React 18</h3>

      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Search
      </button>
      {isPending && <p>pending...</p>}
      {title && (
        <p>
          {id} {title}
        </p>
      )}
      {error && <p>404 not found</p>}
    </div>
  );
}
