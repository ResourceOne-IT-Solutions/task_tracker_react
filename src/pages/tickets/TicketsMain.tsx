import React from "react";
import Tickets from "./index";
import { url } from "inspector";

export interface Props {
  url?: string;
}
function TicketsMain({ url }: Props) {
  return (
    <div>
      <Tickets url={url} />
    </div>
  );
}

export default TicketsMain;
