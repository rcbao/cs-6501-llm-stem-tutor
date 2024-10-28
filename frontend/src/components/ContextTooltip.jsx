import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ContextTooltip = ({ anchorId, content }) => (
    <ReactTooltip
        anchorSelect={anchorId}
        place="top"
        className="bg-gray-800 text-white p-2 rounded-lg shadow-md text-sm font-medium"
    >
        {content}
    </ReactTooltip>
);

export default ContextTooltip;
