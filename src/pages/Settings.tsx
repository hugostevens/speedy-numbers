
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import SettingsGroup from '@/components/settings/SettingsGroup';
import SettingsItem from '@/components/settings/SettingsItem';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { 
  Palette, 
  Target, 
  User, 
  UserCog,
  LogOut
} from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  if (!user) {
    return <div className="page-container">Loading...</div>;
  }
  
  const handleSignOut = () => {
    // In a real app, this would sign the user out
    toast.success('Signed out successfully');
    navigate('/');
  };
  
  return (
    <div className="page-container">
      <PageHeader title="Settings" showBackButton />
      
      <SettingsGroup title="Personalization">
        <SettingsItem
          icon={<Palette size={22} />}
          label="Theme"
          value={user.theme.charAt(0).toUpperCase() + user.theme.slice(1)}
          onClick={() => navigate('/settings/theme')}
        />
        
        <SettingsItem
          icon={<Target size={22} />}
          label="Learning Goals"
          onClick={() => navigate('/settings/goals')}
        />
      </SettingsGroup>
      
      <SettingsGroup title="Account">
        <SettingsItem
          icon={<User size={22} />}
          label="Profile"
          onClick={() => navigate('/settings/profile')}
        />
        
        <SettingsItem
          icon={<UserCog size={22} />}
          label="Parent Controls"
          onClick={() => navigate('/settings/parent-controls')}
        />
      </SettingsGroup>
      
      <button
        onClick={handleSignOut}
        className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </button>
    </div>
  );
};

export default Settings;
