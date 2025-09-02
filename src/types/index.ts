export interface StoredFile {
  id: string;
  name: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
