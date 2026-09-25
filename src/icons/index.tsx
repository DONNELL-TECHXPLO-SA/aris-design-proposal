// Icon set: lucide-react, matching the Finexy design system (outline, 1.5 stroke).
// Export names and default sizes are kept from the original SVG set so call sites don't change.
import {
  Clock,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Box,
  Calendar,
  ChartPie,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleCheck,
  CircleUser,
  ClipboardList,
  Copy,
  DollarSign,
  Download,
  Ellipsis,
  EllipsisVertical,
  Eye,
  EyeOff,
  File,
  FileText,
  Folder,
  Info,
  LayoutGrid,
  ListChecks,
  Lock,
  Mail,
  MessageSquare,
  Music,
  OctagonAlert,
  Package,
  Pencil,
  Plug,
  Plus,
  Send,
  Sparkles,
  Table,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  Users,
  Video,
  X,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

// `stroke` (numeric) is accepted as an alias for `strokeWidth` so call sites written
// against the previous icon set keep working.
export type IconProps = Omit<LucideProps, "stroke"> & { stroke?: number | string };

function withDefaults(LIcon: LucideIcon, defaultSize: number) {
  function SizedIcon({ size = defaultSize, stroke, strokeWidth, ...props }: IconProps) {
    return <LIcon size={size} strokeWidth={strokeWidth ?? (typeof stroke === "number" ? stroke : 1.5)} {...props} />;
  }
  SizedIcon.displayName = LIcon.displayName;
  return SizedIcon;
}

export const AlertIcon = withDefaults(TriangleAlert, 24);
export const AngleDownIcon = withDefaults(ChevronDown, 16);
export const AngleUpIcon = withDefaults(ChevronUp, 16);
export const ArrowDownIcon = withDefaults(ArrowDown, 12);
export const ArrowRightIcon = withDefaults(ArrowRight, 20);
export const ArrowUpIcon = withDefaults(ArrowUp, 12);
export const AudioIcon = withDefaults(Music, 24);
export const BoltIcon = withDefaults(Zap, 24);
export const BoxCubeIcon = withDefaults(Box, 24);
export const BoxIconLine = withDefaults(Package, 24);
export const BoxIcon = withDefaults(Box, 20);
export const BoxTapped = BoxIcon;
export const CalenderIcon = withDefaults(Calendar, 24);
export const ChatIcon = withDefaults(MessageSquare, 24);
export const CheckCircleIcon = withDefaults(CircleCheck, 24);
export const CheckLineIcon = withDefaults(Check, 16);
export const ChevronDownIcon = withDefaults(ChevronDown, 20);
export const ChevronLeftIcon = withDefaults(ChevronLeft, 20);
export const ChevronUpIcon = withDefaults(ChevronUp, 20);
export const CloseLineIcon = withDefaults(X, 16);
export const CloseIcon = withDefaults(X, 24);
export const CopyIcon = withDefaults(Copy, 20);
export const DocsIcon = withDefaults(FileText, 24);
export const DollarLineIcon = withDefaults(DollarSign, 24);
export const DownloadIcon = withDefaults(Download, 24);
export const EnvelopeIcon = withDefaults(Mail, 20);
export const EyeCloseIcon = withDefaults(EyeOff, 20);
export const EyeIcon = withDefaults(Eye, 20);
export const FileIcon = withDefaults(File, 24);
export const FolderIcon = withDefaults(Folder, 20);
export const GridIcon = withDefaults(LayoutGrid, 24);
export const GroupIcon = withDefaults(Users, 24);
export const HorizontaLDots = withDefaults(Ellipsis, 24);
export const ErrorIcon = withDefaults(OctagonAlert, 24);
export const InfoIcon = withDefaults(Info, 24);
export const ListIcon = withDefaults(ClipboardList, 24);
export const LockIcon = withDefaults(Lock, 20);
export const MailIcon = withDefaults(Mail, 24);
export const MoreDotIcon = withDefaults(EllipsisVertical, 24);
export const PageIcon = withDefaults(FileText, 24);
export const PaperPlaneIcon = withDefaults(Send, 20);
export const PencilIcon = withDefaults(Pencil, 20);
export const PieChartIcon = withDefaults(ChartPie, 24);
export const PlugInIcon = withDefaults(Plug, 24);
export const PlusIcon = withDefaults(Plus, 16);
export const ShootingStarIcon = withDefaults(Sparkles, 24);
export const TableIcon = withDefaults(Table, 24);
export const TaskIcon = withDefaults(ListChecks, 24);
export const TimeIcon = withDefaults(Clock, 20);
export const TrashBinIcon = withDefaults(Trash2, 20);
export const UploadIcon = withDefaults(Upload, 18);
export const UserCircleIcon = withDefaults(CircleUser, 24);
export const UserIcon = withDefaults(User, 20);
export const VideoIcon = withDefaults(Video, 24);

// Country flags stay as SVG files; lucide has no flag icons.
export { default as DeFlagIcon } from "./flag-de.svg";
export { default as EsFlagIcon } from "./flag-es.svg";
export { default as SaFlagIcon } from "./flag-sa.svg";
export { default as UsFlagIcon } from "./flag-us.svg";
