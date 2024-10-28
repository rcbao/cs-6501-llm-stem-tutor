import React from "react";
import { DialogTitle } from "@headlessui/react";
import ContextItem from "./ContextItem";

const DialogContent = ({ contexts, onClose }) => (
    <>
        <DialogTitle
            as="h2"
            className="text-xl font-bold leading-6 text-gray-900"
        >
            Response Context
        </DialogTitle>
        <div className="mt-4">
            {contexts.map((context, index) => (
                <ContextItem key={index} context={context} />
            ))}
        </div>
        <div className="flex justify-end mt-6">
            <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </>
);

export default DialogContent;
