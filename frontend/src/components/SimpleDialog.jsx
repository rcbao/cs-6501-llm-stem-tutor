import React, { useState, Fragment } from "react";
import {
    Dialog,
    DialogBackdrop,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import ContextTooltip from "./ContextTooltip";
import DialogContent from "./DialogContent";

const SimpleDialog = ({ contexts }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openDialog = () => {
        console.log("Open dialog");
        console.log(contexts);
        setIsOpen(true);
    };

    const closeDialog = () => setIsOpen(false);

    return (
        <>
            <button className="absolute bottom-3 right-3" id="chat-context">
                <BookOpenIcon
                    className="w-6 h-6 hover:text-lime-500 cursor-pointer dark:text-lime-50"
                    alt="icon"
                    type="button"
                    onClick={openDialog}
                />
                <ContextTooltip
                    anchorId="#chat-context"
                    content="View context"
                />
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={closeDialog}
                >
                    <div className="min-h-screen px-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-30" />
                        </TransitionChild>

                        {/* Centering trick */}
                        <span
                            className="inline-block h-screen align-middle"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block w-full max-w-prose p-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                <DialogContent
                                    contexts={contexts}
                                    onClose={closeDialog}
                                />
                            </div>
                        </TransitionChild>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default SimpleDialog;
