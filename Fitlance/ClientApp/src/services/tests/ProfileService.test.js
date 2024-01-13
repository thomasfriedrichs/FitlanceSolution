import Cookies from 'js-cookie';

import * as service from '.././ProfileService';
import apiClient from '../AxiosAPIClient';

jest.mock('js-cookie');

jest.mock('.././AxiosAPIClient', () => ({
    get: jest.fn(),
    put: jest.fn(),
    create: jest.fn(() => ({
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('Profile Service', () => {
    const mockToken = 'mock-token';
    const mockId = 'mock-id';
    const mockData = { data: 'mock data' };
    const mockError = new Error('mock error');
    let consoleSpy;

    beforeEach(() => {
        Cookies.get.mockImplementation((key) => {
            if (key === 'X-Access-Token') return mockToken;
            if (key === 'Id') return mockId;
        });
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    it('fetchProfile should fetch the user profile successfully', async () => {
        apiClient.get.mockResolvedValue(mockData);

        const profile = await service.fetchProfile();

        expect(apiClient.get).toHaveBeenCalledWith(
            `/api/Users/${mockId}`,
        );
        expect(profile).toBe(mockData.data);
    });

    it('fetchProfile should log an error when request fails', async () => {
        apiClient.get.mockRejectedValue(mockError);

        await service.fetchProfile();

        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    it('putProfile should update the user profile successfully', async () => {
        const requestObject = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        apiClient.put.mockResolvedValue(mockData);

        const result = await service.putProfile(requestObject);

        expect(apiClient.put).toHaveBeenCalledWith(
            `/api/Users/${mockId}`,
            requestObject
        );
        expect(result).toBe(mockData.data);
    });

    it('putProfile should log an error when request fails', async () => {
        const requestObject = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        };
        apiClient.put.mockRejectedValue(mockError);

        await service.putProfile(requestObject);

        expect(console.log).toHaveBeenCalledWith(mockError);
    });
});
