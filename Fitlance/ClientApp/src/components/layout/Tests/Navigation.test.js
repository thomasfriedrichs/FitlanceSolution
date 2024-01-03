import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import Navigation from '.././Navigation'; 

jest.mock('js-cookie', () => ({
    get: jest.fn()
}));

let mockUseCookieWatcherReturn = true;
jest.mock("@fcannizzaro/react-use-cookie-watcher", () => ({
    useCookieWatcher: () => mockUseCookieWatcherReturn
}));

describe('Navigation', () => {
    const mockLogout = jest.fn();
    jest.mock('../../../services/AuthService', () => ({
        logout: mockLogout
    }));

    it('shows Profile and Find Trainers when authenticated as a User', () => {
        Cookies.get.mockImplementation((key) => {
            if (key === "Role") return "User";
            return null;
        });
        mockUseCookieWatcherReturn = true;

        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBe(2); 
        const profileLinks = screen.getAllByText('Profile');
        expect(profileLinks.length).toBe(2); 
        const trainerLinks = screen.getAllByText('Find Trainers');
        expect(trainerLinks.length).toBe(2); 
        const logOutLinks = screen.getAllByText('Log out');
        expect(logOutLinks.length).toBe(2); 
    });

    it('does not show Profile and Find Trainers when not authenticated', () => {
        Cookies.get.mockReturnValue(undefined);
        mockUseCookieWatcherReturn = false;

        render(
            <MemoryRouter>
                <Navigation />
            </MemoryRouter>
        );

        const homeLinks = screen.getAllByText('Home');
        expect(homeLinks.length).toBe(2);
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
        expect(screen.queryByText('Find Trainers')).not.toBeInTheDocument();
        const logInLinks = screen.getAllByText('Log in');
        expect(logInLinks.length).toBe(2); 
    });


});