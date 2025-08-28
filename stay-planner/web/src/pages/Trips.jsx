import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import TripForm from '../components/TripForm';
import TripsTable from '../components/TripsTable';
import Breadcrumb from '../components/Breadcrumb';
import { Card, Title, Toast } from '../styles/common';
import { api } from '../utils/api';
import { Plus, X } from 'lucide-react';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const PageTitle = styled(Title)`
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-normal);
  
  &:hover {
    background: var(--color-primary-hover);
    transform: translateY(-1px);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-surface-light);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  z-index: 10;
  
  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-error);
    color: var(--color-error);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const data = await api.trips.list();
      setTrips(data.trips || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      showToast(error.message || 'Failed to load trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let data;
      
      if (editingTrip) {
        data = await api.trips.update(editingTrip.id, formData);
        setTrips(prev => prev.map(trip => 
          trip.id === editingTrip.id ? data.trip : trip
        ));
        showToast('Trip updated successfully!', 'success');
      } else {
        data = await api.trips.create(formData);
        setTrips(prev => [...prev, data.trip]);
        showToast('Trip added successfully!', 'success');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save trip:', error);
      showToast(error.message || 'Failed to save trip', 'error');
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setShowForm(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    try {
      await api.trips.delete(tripId);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      showToast('Trip deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete trip:', error);
      showToast(error.message || 'Failed to delete trip', 'error');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTrip(null);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <PageContainer>
        <Breadcrumb currentPage="Manage Trips" />
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading trips...</div>
          </div>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumb currentPage="Manage Trips" />
      
      <PageHeader>
        <PageTitle>Manage Trips</PageTitle>
        <AddButton onClick={() => setShowForm(true)}>
          <Plus />
          Add Trip
        </AddButton>
      </PageHeader>

      <TripsTable
        trips={trips}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={() => setShowForm(true)}
      />

      {showForm && (
        <Modal onClick={handleCloseForm}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseForm}>
              <X />
            </CloseButton>
            <TripForm
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              initialData={editingTrip}
              isEditing={!!editingTrip}
              existingTrips={trips}
            />
          </ModalContent>
        </Modal>
      )}

      {toast && (
        <Toast className={`toast-${toast.type}`}>
          {toast.message}
        </Toast>
      )}
    </PageContainer>
  );
};

export default Trips;
