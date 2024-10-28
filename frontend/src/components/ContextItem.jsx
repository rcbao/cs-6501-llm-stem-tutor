import React from "react";
import Markdown from "react-markdown";

const ContextItem = ({ context, index }) => (
    <div key={index} className="mb-6">
        <h2 className="text-lg font-medium">
            This response is based on information found in{" "}
            <span className="font-semibold">{context.file_name}</span>
            {context.file_path && (
                <span className="font-medium"> ({context.file_path})</span>
            )}
            {context.page_label && (
                <span className="font-medium">
                    {" "}
                    on page {context.page_label}
                </span>
            )}
            .
        </h2>
        <Markdown className="prose font-semibold max-h-60 overflow-auto bg-gray-200 p-4 rounded-lg mt-4">
            {`${context.text} ...`}
        </Markdown>
    </div>
);

export default ContextItem;
