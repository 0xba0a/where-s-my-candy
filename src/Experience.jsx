/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
import { OrbitControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import Lights from "./Lights";
import { Level } from "./Level";
import Player from "./Player";
import useGame from "./stores/useGame";
import Effects from "./Effects";

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <color args={["#252731"]} attach={"background"} />

      {/* <OrbitControls makeDefault /> */}

      <Physics>
        {/* <Debug /> */}
        <Lights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>

      <Effects />
    </>
  );
}
