import React from "react";

export const handlePermission = (allPermission, pageName) => {
  if (pageName === "all") {
    return true;
  } else if (allPermission && pageName) {
    let allPermissionArray = String(allPermission)
      .toLowerCase()
      .split(",");
    return allPermissionArray.includes(pageName.toLowerCase());
  } else return false;
};
