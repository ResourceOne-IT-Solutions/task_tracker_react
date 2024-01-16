import React from "react";
import Tickets from "./index";
import { url } from "inspector";

export interface Props {
  url?: string;
}
function Main({ url }: Props) {
  return (
    <div>
      <Tickets url={url} />
    </div>
  );
}

export default Main;
