import { BookIcon, HomeIcon, ImageIcon, LayersIcon, Settings2Icon } from "lucide-react";
import { JSX } from "react";

export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
  dashboard: <HomeIcon />,
  settings: <Settings2Icon />,
  books: <BookIcon />,
  topbanners: <ImageIcon />,
  sections: <LayersIcon />,
  categories : <Settings2Icon />
};

export default navigationIcon;
