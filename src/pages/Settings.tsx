
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import SettingsGroup from '@/components/settings/SettingsGroup';
import SettingsItem from '@/components/settings/SettingsItem';
import { useUser } from '@/context/user';
import { 
  Palette, 
  Target, 
  User, 
  UserCog,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  
  if (!user) {
    return <div className="page-container">Loading...</div>;
  }
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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
      
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full py-6 mt-6 border border-gray-200 rounded-lg flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        <span>Sign Out</span>
      </Button>
    </div>
  );
};

export default Settings;
