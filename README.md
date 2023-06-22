
A component to animate while mounting/unmounting.

uses web animation api


## Install

```sh

npm install @monynethala/animatepresence 
```



## Basic Usage


```tsx
import { useState } from "react";

import { AnimatePresence,Motion } from '@monynethala/animatepresence';
export default function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <button
        onClick={() => {
          setShow(!show);
        }}
      >
        show
      </button>
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            leave={{ opacity: [1, 0] }}
            enter={{ opacity: [0, 1] }}
            className="App"
            key="home"
          >
            
            <h2>stop stalking me</h2>
          </motion.div>
        ) }
      </AnimatePresence>
    </>
  );
}
```


## License

MIT
