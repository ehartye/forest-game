// Keyboard input hook

import { useRef, useEffect } from "react";

function useKeyboard() {
  var keysRef = useRef({});

  useEffect(function () {
    function down(e) {
      keysRef.current[e.key] = true;
    }
    function up(e) {
      keysRef.current[e.key] = false;
    }
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return function () {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return keysRef;
}

export default useKeyboard;
