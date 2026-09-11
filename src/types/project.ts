import { ReactNode } from "react";
import { IconType } from "react-icons";

export interface TChildren {
  children: ReactNode;
}

export interface TDashboardItem {
  id: string;
  title: string;
  path?: string;
  icon: IconType;
  children?: TDashboardItem[];
  iconColor?:string
  feature:string
}
