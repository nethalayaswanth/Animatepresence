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
        {show ? (
          <motion.div
            leave={{ opacity: [1, 0] }}
            enter={{ opacity: [0, 1] }}
            className="App"
            key="home"
          >
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
          </motion.div>
        ) : (
          <motion.div
            leave={{ opacity: [1, 0] }}
            enter={{ opacity: [0, 1] }}
            className="App"
            key="mony"
          >
            <h1>MOny</h1>
            <h2>yeah yeah!</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
