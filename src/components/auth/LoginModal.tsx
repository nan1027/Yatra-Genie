import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter your email to access your saved trips and create new adventures.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-border/50 focus:border-primary"
                disabled={isSubmitting}
              />
            </div>
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-destructive"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Continue with Email'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            No password needed • We'll remember you
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
