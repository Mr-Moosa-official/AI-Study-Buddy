
import { Logo } from '../icons';

export default function Header() {
  return (
    <header className="px-4 sm:px-6 lg:px-8 py-4 border-b">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-headline">
          AI Study Buddy
        </h1>
      </div>
    </header>
  );
}
