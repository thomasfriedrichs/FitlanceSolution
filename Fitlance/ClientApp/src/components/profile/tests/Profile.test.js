import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Profile from '.././Profile';

jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
    useQueryClient: jest.fn(),
}));

jest.mock('../../../services/ProfileService', () => ({
    fetchProfile: jest.fn()
}));

jest.mock('../../appointments/Appointments', () => () => <div>Appointments Component</div>);

beforeEach(() => {
    jest.clearAllMocks();

    useQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
    });

    useMutation.mockReturnValue({
        mutate: jest.fn(),
    });

    useQueryClient.mockReturnValue({
        invalidateQueries: jest.fn(),
    });
});

describe('Profile Component', () => {
    it('displays loading state initially', () => {
        useQuery.mockReturnValue({ isLoading: true });
        render(<Profile />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays error state', () => {
        useQuery.mockReturnValue({
            isError: true,
            error: { message: 'An error occurred' }
        });
        render(<Profile />);
        expect(screen.getByText('Error: An error occurred')).toBeInTheDocument();
    });

    it('displays user info correctly', async () => {
        useQuery.mockReturnValue({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                zipCode: '12345',
                city: 'Metropolis',
                bio: 'A short bio here'
            },
            isLoading: false
        });
        render(<Profile />);
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('Metropolis')).toBeInTheDocument();
        expect(screen.getByText('A short bio here')).toBeInTheDocument();
    });

    it('switches to edit view when edit button is clicked', () => {
        useQuery.mockReturnValue({
            data: {
                firstName: 'John',
                lastName: 'Doe',
                zipCode: '12345',
                city: 'Metropolis',
                bio: 'A short bio here'
            },
            isLoading: false
        });
        render(<Profile />);
        fireEvent.click(screen.getByText('Edit Profile'));
        expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('renders the Appointments component', () => {
        useQuery.mockReturnValue({
            isLoading: false,
            data: {}
        });
        render(<Profile />);
        expect(screen.getByText('Appointments Component')).toBeInTheDocument();
    });
});
