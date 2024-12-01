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

export type ResponseErrorType = {
  status: number;
  data: {
    code: number;
    error: string;
    message: boolean;
  };
};

export interface PaginationType {
  limit?: number;
  page?: number;
  order_by?: "DESC" | "ASC";
}

export interface ListPaginationType<T> {
  items: T[];
  meta: {
    current_page: number;
    total: number;
  };
}

export interface OptionType<T> {
  value: T;
  label: string;
  disabled: boolean;
}
