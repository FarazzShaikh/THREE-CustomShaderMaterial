import Water from "../components/Water";
// @ts-ignore
import { motion } from "framer-motion/three";

export default function WaterAssembly() {
  return (
    <motion.group
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      exit={{
        scale: 0,
      }}
    >
      <Water />
    </motion.group>
  );
}
