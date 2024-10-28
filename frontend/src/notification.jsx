import { toast } from "react-hot-toast";

const toastStyle = {
    className: "font-bold",
    style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
    },
};

export const successToast = (message) => {
    toast.success(message, toastStyle);
};

export const errorToast = (message) => {
    toast.error(message, toastStyle);
};
