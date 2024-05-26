import fs from "fs";
import { join } from "path";

export const checkIsDockerContainer = () => {
  try {
    fs.accessSync(join("/", ".dockerenv"));
    return true;
  } catch (error) {
    return false;
  }
};
