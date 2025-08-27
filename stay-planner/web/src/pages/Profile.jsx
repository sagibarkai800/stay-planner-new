import React, { useState } from 'react';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  Grid2,
  FlexCenter,
  FlexBetween,
  IconContainer,
  Icon,
  Spacer,
  SuccessMessage,
  InfoMessage,
  Input,
  Label,
  FormGroup,
  Form
} from '../styles/common';
import styled from '@emotion/styled';
import Breadcrumb from '../components/Breadcrumb';
import { User, Mail, Shield, Save } from 'lucide-react';

// Profile-specific styled components
const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 50%, #E6F7F0 100%);
  padding: 2rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const ProfileCard = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileAvatar = styled.div`
  width: 8rem;
  height: 8rem;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.3);
`;

const AvatarIcon = styled.div`
  font-size: 3rem;
  color: white;
`;

const ProfileName = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProfileEmail = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
`;

const ProfileStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 0.75rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const SettingsSection = styled(Card)`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
`;

const SettingsForm = styled(Form)`
  max-width: 500px;
  margin: 0 auto;
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  width: 100%;
  margin-top: 1rem;
  box-shadow: 
    0 10px 15px -3px rgba(16, 185, 129, 0.3),
    0 4px 6px -2px rgba(16, 185, 129, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #059669, #047857);
    transform: translateY(-2px);
    box-shadow: 
      0 20px 25px -5px rgba(16, 185, 129, 0.4),
      0 10px 10px -5px rgba(16, 185, 129, 0.3);
  }
`;

const DangerZone = styled(Card)`
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
  box-shadow: 
    0 20px 25px -5px rgba(239, 68, 68, 0.1),
    0 10px 10px -5px rgba(239, 68, 68, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
`;

const DangerTitle = styled.h3`
  color: #dc2626;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

const DangerText = styled.p`
  color: #991b1b;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const DeleteAccountButton = styled(Button)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  width: 100%;
  box-shadow: 
    0 10px 15px -3px rgba(239, 68, 68, 0.3),
    0 4px 6px -2px rgba(239, 68, 68, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    transform: translateY(-2px);
    box-shadow: 
      0 20px 25px -5px rgba(239, 68, 68, 0.4),
      0 10px 10px -5px rgba(239, 68, 68, 0.3);
  }
`;

const Profile = () => {
  const [profile, setProfile] = useState({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    notifications: true,
    timezone: 'UTC+1'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Here you would typically save to the backend
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Here you would typically call the backend to delete the account
      console.log('Account deletion requested');
    }
  };

  return (
    <ProfileContainer>
      <Breadcrumb currentPage="Profile Settings" />
      
      <HeaderSection>
        <PageTitle>My Profile 👤</PageTitle>
        <PageSubtitle>
          Manage your account settings and preferences
        </PageSubtitle>
      </HeaderSection>

      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            <AvatarIcon>👤</AvatarIcon>
          </ProfileAvatar>
          <ProfileName>{profile.firstName} {profile.lastName}</ProfileName>
          <ProfileEmail>{profile.email}</ProfileEmail>
        </ProfileHeader>

        <ProfileStats>
          <StatItem>
            <StatValue>12</StatValue>
            <StatLabel>Total Trips</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>8</StatValue>
            <StatLabel>Documents</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>45</StatValue>
            <StatLabel>Schengen Days</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>2</StatValue>
            <StatLabel>Years Active</StatLabel>
          </StatItem>
        </ProfileStats>

        <FlexCenter>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            {isEditing ? '✏️ Cancel Edit' : '✏️ Edit Profile'}
          </Button>
        </FlexCenter>
      </ProfileCard>

      <SettingsSection>
        <Title style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          Account Settings
        </Title>
        <SettingsForm onSubmit={handleSave}>
          <Grid2>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                disabled={!isEditing}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                disabled={!isEditing}
                required
              />
            </FormGroup>
          </Grid2>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              type="text"
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              disabled={!isEditing}
              placeholder="e.g., UTC+1, EST, PST"
            />
          </FormGroup>
          
          {isEditing && (
            <SaveButton type="submit">
              💾 Save Changes
            </SaveButton>
          )}
        </SettingsForm>
      </SettingsSection>

      <DangerZone>
        <DangerTitle>⚠️ Danger Zone</DangerTitle>
        <DangerText>
          Once you delete your account, there is no going back. Please be certain.
        </DangerText>
        <DeleteAccountButton onClick={handleDeleteAccount}>
          🗑️ Delete Account
        </DeleteAccountButton>
      </DangerZone>
    </ProfileContainer>
  );
};

export default Profile;
