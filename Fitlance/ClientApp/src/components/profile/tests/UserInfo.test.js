import React from 'react';
import { render, screen } from '@testing-library/react';
import UserInfo from '.././UserInfo';

describe('UserInfo Component', () => {
    const baseMockData = {
        firstName: 'John',
        lastName: 'Doe',
        zipCode: '12345',
        city: 'Metropolis',
        bio: 'A short bio here'
    };

    it('should display user information', () => {
        render(<UserInfo data={baseMockData} />);
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('12345')).toBeInTheDocument();
        expect(screen.getByText('Metropolis')).toBeInTheDocument();
        expect(screen.getByText('A short bio here')).toBeInTheDocument();
    });

    it('displays message to update name when firstName or lastName is null', () => {
        const mockData = { ...baseMockData, firstName: null };
        render(<UserInfo data={mockData} />);
        expect(screen.getByText(/Please update Name/i)).toBeInTheDocument();
    });

    it('displays message to update city when city is null', () => {
        const mockData = { ...baseMockData, city: null };
        render(<UserInfo data={mockData} />);
        expect(screen.getByText(/Please update City/i)).toBeInTheDocument();
    });

    it('displays message to update zipcode when zipCode is null', () => {
        const mockData = { ...baseMockData, zipCode: null };
        render(<UserInfo data={mockData} />);
        expect(screen.getByText(/Please update Zipcode/i)).toBeInTheDocument();
    });

    it('displays message to update bio when bio is null', () => {
        const mockData = { ...baseMockData, bio: null };
        render(<UserInfo data={mockData} />);
        expect(screen.getByText(/Please update Bio/i)).toBeInTheDocument();
    });
});
