
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm font-medium">{text}</p>
    </div>
  );
}
