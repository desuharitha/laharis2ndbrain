import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Download, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Check className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-lg font-mono font-bold text-foreground">Already Installed!</h1>
          <p className="text-sm text-muted-foreground">You're running Laharis2ndBrain as an app.</p>
          <Button variant="ghost" asChild><Link to="/">Go to App</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h1 className="text-base font-mono font-bold text-foreground">Install App</h1>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-2xl mx-auto overflow-hidden border border-border">
            <img src="/icons/icon-192.png" alt="App icon" width={80} height={80} className="w-full h-full" />
          </div>
          <h2 className="text-lg font-mono font-bold text-foreground">Laharis2ndBrain</h2>
          <p className="text-sm text-muted-foreground">Install on your phone for a native app experience — offline access, home screen icon, full screen.</p>
        </div>

        {installed ? (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center space-y-2">
            <Check className="h-8 w-8 text-green-500 mx-auto" />
            <p className="text-sm font-medium text-foreground">App installed successfully!</p>
            <p className="text-xs text-muted-foreground">Find it on your home screen.</p>
          </div>
        ) : deferredPrompt ? (
          <Button onClick={handleInstall} className="w-full gap-2" size="lg">
            <Download className="h-4 w-4" />
            Install App
          </Button>
        ) : isIOS ? (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-mono font-semibold text-foreground">Install on iPhone / iPad</h3>
            </div>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Tap the <strong className="text-foreground">Share</strong> button (square with arrow) in Safari</li>
              <li>Scroll down and tap <strong className="text-foreground">Add to Home Screen</strong></li>
              <li>Tap <strong className="text-foreground">Add</strong> in the top right</li>
            </ol>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-mono font-semibold text-foreground">Install on Android</h3>
            </div>
            <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
              <li>Tap the <strong className="text-foreground">⋮ menu</strong> (three dots) in Chrome</li>
              <li>Tap <strong className="text-foreground">Add to Home screen</strong> or <strong className="text-foreground">Install app</strong></li>
              <li>Tap <strong className="text-foreground">Install</strong></li>
            </ol>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Same data, same account — synced via Lovable Cloud.
        </p>
      </main>
    </div>
  );
};

export default Install;
