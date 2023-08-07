import { useEffect, useState } from "react";
import { Store } from "../interfaces";
import { toDateTime } from "../functions";

export const useCloseOpen = (Store: Store) => {
  const [OpenDateString, setOpenDateString] = useState("");
  const [CloseDateString, setCloseDateString] = useState("");

  useEffect(() => {
    const OpenDate = toDateTime(Store.openHoursObject.openFrom)
      .toLocaleTimeString()
      .split(":");

    if (Store.openHoursObject.closedFrom > 86400)
      Store.openHoursObject.closedFrom -= 86400;
    const CloseDate = toDateTime(Store.openHoursObject.closedFrom)
      .toLocaleTimeString()
      .split(":");

    setOpenDateString(OpenDate[0] + ":" + OpenDate[1]);
    setCloseDateString(CloseDate[0] + ":" + CloseDate[1]);
  }, [Store]);

  return { OpenDateString, CloseDateString };
};
