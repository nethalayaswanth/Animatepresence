
A component to animate while mounting/unmounting.

uses web animation api


## Install

```sh
yarn add animatepresence 
# or
npm install animatepresence 
```



## Basic Usage


```tsx
import { useState } from "react";
import "./styles.css";
import motion from "./motion";
import { AnimatePresence } from "./animatePresence";
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
