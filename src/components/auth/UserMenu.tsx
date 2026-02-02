import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UserMenuProps {
  variant?: 'default' | 'glass';
}

const UserMenu = ({ variant = 'default' }: UserMenuProps) => {
  const { user, isAuthenticated, signOut, isLoading } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant={variant === 'glass' ? 'glass' : 'outline'}
          size="sm"
          onClick={() => setIsLoginOpen(true)}
          className="gap-2"
        >
          <User className="w-4 h-4" />
          Sign In
        </Button>
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'glass' ? 'glass' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-xs font-semibold text-white">
              {user?.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate">
            {user?.email.split('@')[0]}
          </span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card">
        <div className="px-2 py-2 border-b border-border/50">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-muted-foreground">Traveler</p>
        </div>
        <DropdownMenuItem asChild>
          <Link to="/my-trips" className="cursor-pointer">
            <MapPin className="w-4 h-4 mr-2" />
            My Trips
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
