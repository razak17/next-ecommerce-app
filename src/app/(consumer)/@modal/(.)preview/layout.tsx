import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ModalLayout({ children }: React.PropsWithChildren) {
  return (
    <AlertDialog defaultOpen={true}>
      <AlertDialogContent className="max-w-3xl overflow-hidden p-0">
        <AlertDialogHeader className="hidden">
          <AlertDialogTitle>title</AlertDialogTitle>
          <AlertDialogDescription>description</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter className="hidden"></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
