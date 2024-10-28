import { toast } from "react-toastify";

export default function notify(text, type) {
    switch (type) {
        case "success":
          return toast.success(text, {
            className: "bg-green-500 text-white",
            bodyClassName: "font-bold text-sm",
            progressClassName: "bg-green-200",
          });
      
        case "error":
          return toast.error(text, {
            className: "bg-red-500 text-white",
            bodyClassName: "font-bold text-sm",
            progressClassName: "bg-red-200",
          });
      
        default:
          return toast.info(text, {
            className: "bg-blue-500 text-white",
            bodyClassName: "font-bold text-sm",
            progressClassName: "bg-blue-200",
          });
      }
      
}
