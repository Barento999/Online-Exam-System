import { createContext, useContext, useState } from "react";

const BreadcrumbContext = createContext();

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider",
    );
  }
  return context;
};

export const BreadcrumbProvider = ({ children }) => {
  const [customBreadcrumbs, setCustomBreadcrumbs] = useState(null);

  const setBreadcrumbs = (breadcrumbs) => {
    setCustomBreadcrumbs(breadcrumbs);
  };

  const clearBreadcrumbs = () => {
    setCustomBreadcrumbs(null);
  };

  const addBreadcrumb = (breadcrumb) => {
    setCustomBreadcrumbs((prev) => {
      if (!prev) return [breadcrumb];
      return [...prev, breadcrumb];
    });
  };

  const updateBreadcrumb = (index, breadcrumb) => {
    setCustomBreadcrumbs((prev) => {
      if (!prev) return null;
      const updated = [...prev];
      updated[index] = breadcrumb;
      return updated;
    });
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        customBreadcrumbs,
        setBreadcrumbs,
        clearBreadcrumbs,
        addBreadcrumb,
        updateBreadcrumb,
      }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};
