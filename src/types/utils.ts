export interface BreadcrumbType {
  title: string;
  link: string;
}

export interface MenuItemType {
  title: string;
  link?: string;
  icon?: JSX.Element;
  children?: MenuItemType[];
  isOpen?: boolean;
}

export interface ResponseType<T> {
  code: number;
  message: boolean;
  data: T;
}

export interface PaginationType {
  limit?: number;
  page?: number;
}
export interface ListPaginationType<T> {
  items: T[];
  meta: {
    current_page: number;
    total: number;
  }
}
