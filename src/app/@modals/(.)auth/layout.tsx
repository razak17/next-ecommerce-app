import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ModalLayout({ children }: React.PropsWithChildren) {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
        {children}
      </DialogContent>
    </Dialog>
  );
}
