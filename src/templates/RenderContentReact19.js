import { use, Suspense, useState } from "react";
import { fetcher } from "./fetcher";

//client component 不支持 async
function Comments() {
  // 类似于 RSC 中 async  FC 里直接 await
  // fetcher(1) resolve 前打到组件树 Suspense
  const comments = use(fetcher(1));
  return (
    <>
      <p>RenderContentUse</p>
      <p>{comments?.title}</p>
    </>
  );
}

export function RenderContentUse() {
  const [name, setName] = useState("");
  // 同样 name 变一下  Comments loading 一下， 和 RSC 一致
  return (
    <>
      <h3>Render Content using React 19</h3>
      <Suspense fallback={<div>Loading...</div>}>
        <input value={name} onChange={(event) => setName(event.target.value)} />
        <Comments />
      </Suspense>
    </>
  );
}
