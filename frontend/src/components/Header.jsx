import { Link } from "react-router-dom";
import { Popover } from "@headlessui/react";

export default function Header() {
    return (
        <Popover className="sticky top-0 z-50 bg-lime-900 shadow-sm">
            <div className="mx-auto">
                <div className="flex items-center justify-between py-4 space-x-10 px-8">
                    <div className="flex justify-start px-16">
                        <span className="sr-only">STEM Tutor</span>
                        <Link to={`/`} style={{ textDecoration: "none" }}>
                            <h2 className="font-bold tracking-tight text-lime-100 text-xl dark:hover:text-lime-200">
                                STEM Tutor
                            </h2>
                        </Link>
                    </div>
                </div>
            </div>
        </Popover>
    );
}
