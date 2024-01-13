import Cookies from 'js-cookie';

import * as AuthService from '.././AuthService';
import apiClient from '../AxiosAPIClient';

jest.mock('js-cookie');

const mockLoginRegisterResponse = {
    data: {
        Id: "mockId",
        userRole: ["mockRole"]
    }
};

jest.mock('.././AxiosAPIClient', () => ({
    post: jest.fn(),
    create: jest.fn(() => ({
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('AuthService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        apiClient.post.mockClear();
        Object.defineProperty(window, 'location', {
            writable: true,
            value: { href: jest.fn() }
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('login should set cookies and redirect on successful login', async () => {
        apiClient.post.mockResolvedValue(mockLoginRegisterResponse);

        await AuthService.login('test@example.com', 'password');

        expect(Cookies.set).toHaveBeenCalledWith('Id', mockLoginRegisterResponse.data.Id);
        expect(Cookies.set).toHaveBeenCalledWith('Role', mockLoginRegisterResponse.data.userRole[0]);
        expect(window.location.href).toBe('/');
        apiClient.post.mockReset();
    });

    it('login should handle errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        apiClient.post.mockRejectedValue(new Error('Error'));

        try {
            await AuthService.login('test@example.com', 'password');
        } catch (error) {
            expect(error).toBeDefined();
        }

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
        apiClient.post.mockReset(); 
    });


    it('logout should remove cookies', async () => { 
        const id = 'mockId';

        await AuthService.logout(id);

        expect(Cookies.remove).toHaveBeenCalledWith('Id');
        expect(Cookies.remove).toHaveBeenCalledWith('Role');
    });

    it('register should set cookies and redirect on successful registration', async () => {
        apiClient.post.mockResolvedValue(mockLoginRegisterResponse);

        await AuthService.register('username', 'test@example.com', 'password', 'role');

        expect(Cookies.set).toHaveBeenCalledWith('Id', mockLoginRegisterResponse.data.Id);
        expect(Cookies.set).toHaveBeenCalledWith('Role', mockLoginRegisterResponse.data.userRole[0]);
        expect(window.location.href).toBe('/');
        apiClient.post.mockReset();

    });

    it('register should handle errors', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        apiClient.post.mockRejectedValue(new Error('Error'));

        try {
            await AuthService.register('username', 'test@example.com', 'password', 'role');
        } catch (error) {
            expect(error).toBeDefined();
        }

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
        apiClient.post.mockReset();

    });

});

// Mocks to prevent errors during testing
Object.defineProperty(window, 'location', {
    value: {
        href: jest.fn()
    }
});