import React, { useState } from 'react';
import {
  Card,
  Title,
  Subtitle,
  Text,
  Button,
  Grid2,
  Grid3,
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
  Form,
  Select,
  Badge,
  Alert
} from '../styles/common';
import styled from '@emotion/styled';

const DemoContainer = styled.div`
  min-height: 100vh;
  background: var(--color-bg);
  padding: var(--spacing-8);
`;

const Section = styled.div`
  margin-bottom: var(--spacing-12);
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin-bottom: var(--spacing-6);
  text-align: center;
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-8);
`;

const ComponentCard = styled(Card)`
  text-align: center;
`;

const DesignSystemDemo = () => {
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    <DemoContainer>
      <Section>
        <SectionTitle>🎨 Design System Components</SectionTitle>
        <Subtitle style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
          A complete collection of reusable components with WCAG-compliant design tokens
        </Subtitle>
      </Section>

      {/* Buttons Section */}
      <Section>
        <SectionTitle>🔘 Buttons</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Primary Button
            </Title>
            <Button>Click me</Button>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Secondary Button
            </Title>
            <SecondaryButton>Secondary</SecondaryButton>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Large Button
            </Title>
            <LargeButton>Large Button</LargeButton>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Form Elements Section */}
      <Section>
        <SectionTitle>📝 Form Elements</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Input Field
            </Title>
            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </FormGroup>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Select Dropdown
            </Title>
            <FormGroup>
              <Label>Country</Label>
              <Select
                value={selectValue}
                onChange={(e) => setSelectValue(e.target.value)}
              >
                <option value="">Select a country</option>
                <option value="france">France</option>
                <option value="germany">Germany</option>
                <option value="italy">Italy</option>
                <option value="spain">Spain</option>
              </Select>
            </FormGroup>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Large Input
            </Title>
            <FormGroup>
              <Label>Full Name</Label>
              <LargeInput
                type="text"
                placeholder="Enter your full name"
              />
            </FormGroup>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Badges Section */}
      <Section>
        <SectionTitle>🏷️ Badges</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Status Badges
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Badge className="badge-primary">Primary</Badge>
              <Badge className="badge-secondary">Secondary</Badge>
              <Badge className="badge-success">Success</Badge>
              <Badge className="badge-warning">Warning</Badge>
              <Badge className="badge-error">Error</Badge>
              <Badge className="badge-info">Info</Badge>
            </div>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Alerts Section */}
      <Section>
        <SectionTitle>🚨 Alerts</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Alert Types
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <Alert className="alert-info">
                This is an informational alert
              </Alert>
              <Alert className="alert-success">
                This is a success alert
              </Alert>
              <Alert className="alert-warning">
                This is a warning alert
              </Alert>
              <Alert className="alert-error">
                This is an error alert
              </Alert>
            </div>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Cards Section */}
      <Section>
        <SectionTitle>🃏 Cards</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Regular Card
            </Title>
            <Text>This is a standard card with hover effects</Text>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Large Card
            </Title>
            <Text>This demonstrates the large card variant</Text>
          </ComponentCard>
          
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Medium Card
            </Title>
            <Text>This shows the medium card size</Text>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Typography Section */}
      <Section>
        <SectionTitle>📖 Typography</SectionTitle>
        <ComponentCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <LargeTitle>Large Title</LargeTitle>
            <MediumTitle>Medium Title</MediumTitle>
            <Title>Regular Title</Title>
            <LargeSubtitle>Large Subtitle</LargeSubtitle>
            <MediumSubtitle>Medium Subtitle</MediumSubtitle>
            <Subtitle>Regular Subtitle</Subtitle>
            <Text>This is regular body text with proper line height and spacing.</Text>
          </div>
        </ComponentCard>
      </Section>

      {/* Icons Section */}
      <Section>
        <SectionTitle>🎯 Icons</SectionTitle>
        <ComponentGrid>
          <ComponentCard>
            <Title style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-4)' }}>
              Icon Containers
            </Title>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-4)' }}>
              <IconContainer style={{ width: '3rem', height: '3rem' }}>
                <Icon>🏠</Icon>
              </IconContainer>
              <LargeIconContainer style={{ width: '4rem', height: '4rem' }}>
                <LargeIcon>✈️</LargeIcon>
              </LargeIconContainer>
            </div>
          </ComponentCard>
        </ComponentGrid>
      </Section>

      {/* Spacing Utilities */}
      <Section>
        <SectionTitle>📏 Spacing Utilities</SectionTitle>
        <ComponentCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <div style={{ height: 'var(--spacing-2)', background: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}></div>
            <div style={{ height: 'var(--spacing-4)', background: 'var(--color-secondary)', borderRadius: 'var(--radius-sm)' }}></div>
            <div style={{ height: 'var(--spacing-6)', background: 'var(--color-accent)', borderRadius: 'var(--radius-sm)' }}></div>
            <div style={{ height: 'var(--spacing-8)', background: 'var(--color-success)', borderRadius: 'var(--radius-sm)' }}></div>
          </div>
        </ComponentCard>
      </Section>
    </DemoContainer>
  );
};

export default DesignSystemDemo;
