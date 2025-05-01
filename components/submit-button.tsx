"use client";

import { Button } from "@/components/ui/button";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  pending?: boolean;
};

export function SubmitButton({
  children,
  pendingText = "Envoi en cours...",
  pending: pendingProp,
  ...props
}: Props) {
  const { pending: formStatusPending } = useFormStatus();
  const isPending = pendingProp !== undefined ? pendingProp : formStatusPending;

  return (
    <Button type="submit" aria-disabled={isPending} {...props}>
      {isPending ? pendingText : children}
    </Button>
  );
}
