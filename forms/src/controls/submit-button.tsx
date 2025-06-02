import { type ComponentProps, ReactElement, useContext } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { KdnkFormContext } from "@/form/context";

export function KdSubmitButton({
  pendingElement,
  ...props
}: ComponentProps<"button"> & {
  pendingElement?: ReactElement;
}) {
  const kdnkFormContext = useContext(KdnkFormContext);

  return (
    <Button
      {...props}
      disabled={kdnkFormContext.isActionPending}
      type="submit"
      aria-disabled={kdnkFormContext.isActionPending}
    >
      {kdnkFormContext.isActionPending
        ? pendingElement ?? <LoaderCircle className="animate-spin" />
        : props.children}
    </Button>
  );
}
