import { useTransition, useState, useActionState } from "react";

import { fetcher } from "./fetcher";

export function SearchContentUseActionState() {
  const [payload, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      console.log("previousState", previousState);
      const name = formData.get("name");
      const payload = await fetcher(name);
      return payload;
    }
  );

  return (
    <>
      <h3>Search Content using React 19</h3>
      <form action={submitAction}>
        <input type="text" name="name" />
        <button type="submit" disabled={isPending}>
          Search
        </button>
        {isPending && <p>pending...</p>}
        {payload?.title && (
          <p>
            {payload.id} {payload.title}
          </p>
        )}
        {!payload?.title && <p>404 not found</p>}
      </form>
    </>
  );
}
