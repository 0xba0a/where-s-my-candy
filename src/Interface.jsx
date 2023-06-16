import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { addEffect } from "@react-three/fiber";
import useGame from "./stores/useGame";

export default function Interface() {
  const time = useRef();

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);

      if (time.current) {
        time.current.textContent = elapsedTime;
      }
    });

    return () => {
      unsubscribeEffect();
    };
  });

  return (
    <div className={"interface"}>
      {/* Time */}
      <div ref={time} className={"time"}>
        0.00
      </div>

      {/* Restart */}
      {phase === "ended" ? (
        <div className={"restart"} onClick={restart}>
          Restart
        </div>
      ) : null}

      {/* Controls */}
      <div className={"controls"}>
        <div className={"raw"}>
          <div className={`key ${forward ? "active" : null}`}></div>
        </div>
        <div className={"raw"}>
          <div className={`key ${leftward ? "active" : null}`}></div>
          <div className={`key ${backward ? "active" : null}`}></div>
          <div className={`key ${rightward ? "active" : null}`}></div>
        </div>
        <div className={"raw"}>
          <div className={`key ${jump ? "active" : null} large`}></div>
        </div>
      </div>
    </div>
  );
}
