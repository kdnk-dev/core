import React, { useContext } from "react";
import { KdnkFormContext } from "@/form/context";

export const KdEditModeOnly = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const kdnkFormContext = useContext(KdnkFormContext);

  return kdnkFormContext.formMode == "edit" && children;
};

export const KdViewModeOnly = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const kdnkFormContext = useContext(KdnkFormContext);

  return kdnkFormContext.formMode != "edit" && children;
};

export const KdEditableViewModeOnly = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const kdnkFormContext = useContext(KdnkFormContext);

  return kdnkFormContext.formMode == "view-editable" && children;
};

export const KdReadOnlyViewModeOnly = ({
  children,
}: {
  children: React.JSX.Element | React.JSX.Element[];
}) => {
  const kdnkFormContext = useContext(KdnkFormContext);

  return kdnkFormContext.formMode == "view-readonly" && children;
};
