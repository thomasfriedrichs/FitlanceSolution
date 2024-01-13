import Cookies from 'js-cookie';

import * as service from '.././TrainerService';
import apiClient from '../AxiosAPIClient';

jest.mock('js-cookie');

jest.mock('.././AxiosAPIClient', () => ({
    get: jest.fn(),
    create: jest.fn(() => ({
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('Trainer Service', () => {
    const mockToken = 'mock-token';
    const mockData = { data: 'mock data' };
    const mockError = new Error('mock error');
    let consoleSpy;

    beforeEach(() => {
        Cookies.get.mockReturnValue(mockToken);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    it('fetchTrainers should fetch trainers successfully', async () => {
        apiClient.get.mockResolvedValue(mockData);

        const trainers = await service.fetchTrainers();

        expect(apiClient.get).toHaveBeenCalledWith('/api/Users/FindTrainers');
        expect(trainers).toBe(mockData.data);
    });

    it('fetchTrainers should log an error when the request fails', async () => {
        apiClient.get.mockRejectedValue(mockError);
        await service.fetchTrainers();

        expect(console.log).toHaveBeenCalledWith(mockError);
    });
});