import { Link } from "@/i18n/navigation";
import { CircleAlert as IconAlertCircle, TriangleAlert as IconAlertTriangle, CircleCheck as IconCircleCheck, Info as IconInfoCircle } from "lucide-react";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info"; // Alert type
  title: string; // Title of the alert
  message: string; // Message of the alert
  showLink?: boolean; // Whether to show the "Learn More" link
  linkHref?: string; // Link URL
  linkText?: string; // Link text
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  showLink = false,
  linkHref = "#",
  linkText = "Learn more",
}) => {
  // Finexy has no alert pattern: rendered as an inner grey tile (#F5F5F5, radius 20px)
  // with the status carried by the icon colour (green / yellow / red / blue).
  const iconColor = {
    success: "text-green",
    error: "text-red",
    warning: "text-yellow",
    info: "text-blue",
  };

  // Icon for each variant
  const icons = {
    success: <IconCircleCheck size={22} strokeWidth={1.5} />,
    error: <IconAlertCircle size={22} strokeWidth={1.5} />,
    warning: <IconAlertTriangle size={22} strokeWidth={1.5} />,
    info: <IconInfoCircle size={22} strokeWidth={1.5} />,
  };

  return (
    <div className="rounded-tile bg-tile p-[20px]" role={variant === "error" ? "alert" : "status"}>
      <div className="flex items-start gap-[14px]">
        <span className={`flex size-[40px] shrink-0 items-center justify-center rounded-full bg-card ${iconColor[variant]}`}>
          {icons[variant]}
        </span>

        <div className="min-w-0 pt-[8px]">
          <h4 className="text-fx-17 leading-tight font-medium text-ink">{title}</h4>

          <p className="mt-[6px] text-fx-15 text-secondary">{message}</p>

          {showLink && (
            <Link
              href={linkHref}
              className="mt-[10px] inline-block text-fx-15 font-medium text-ink underline underline-offset-2"
            >
              {linkText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alert;
