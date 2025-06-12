import { IconType } from "react-icons";

interface SkillTagProps {
    icon: IconType;
    children: string;
    iconSize?: string;
}

const SkillTag = ({ icon: Icon, children, iconSize = "text-sm" }: SkillTagProps) => (
  <span className="skill text-xs px-2 py-1 rounded inspectable flex items-center gap-1">
    <Icon className={iconSize} /> {children}
  </span>
);

export default SkillTag;
