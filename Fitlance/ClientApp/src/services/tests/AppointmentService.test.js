import Cookies from 'js-cookie';

import * as service from '.././AppointmentService.js';
import apiClient from '../AxiosAPIClient.js';

jest.mock('js-cookie');

jest.mock('.././AxiosAPIClient', () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
    create: jest.fn(() => ({
        interceptors: {
            response: {
                use: jest.fn(),
            },
        },
    })),
}));

describe('Appointment Service', () => {
    const mockToken = 'test-token';
    const mockId = 'test-id';
    const mockData = { data: 'test data' };
    const mockError = new Error('test error');
    let consoleSpy;


    beforeEach(() => {
        Cookies.get.mockImplementation((key) => {
            if (key === 'X-Access-Token') return mockToken;
            if (key === 'Id') return mockId;
        });
        apiClient.post.mockResolvedValue(mockData);
        apiClient.put.mockResolvedValue(mockData);
        apiClient.get.mockResolvedValue(mockData);
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
        consoleSpy.mockRestore();
    });

    // Test for postAppointment
    it('should post an appointment correctly', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 2),
            id: '123',
        };
        await service.postAppointment(requestObject);
        expect(apiClient.post).toHaveBeenCalledWith(
            '/api/Appointments',
            requestObject,
        );
    });

    it('should handle errors in postAppointment', async () => {
        apiClient.post.mockRejectedValueOnce(mockError);
        await service.postAppointment({});
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    // Test for putAppointment
    it('should update an appointment correctly', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 3),
            id: '123',
        };
        const response = await service.putAppointment('123', requestObject);
        expect(apiClient.put).toHaveBeenCalledWith(
            '/api/Appointments/123',
            requestObject
        );
        expect(response).toEqual(mockData);
    });

    it('should handle errors in putAppointment', async () => {
        const startTime = new Date();

        const requestObject = {
            city: 'Seattle',
            country: 'USA',
            postalCode: 91805,
            state: 'WA',
            trainerId: 'trainerId2194324',
            streetAddress: '992834 33rd st',
            startTimeUtc: startTime,
            endTimeUtc: addHoursToDate(startTime, 2),
            id: '123',
        };

        apiClient.put.mockRejectedValueOnce(mockError);

        await service.putAppointment('123', requestObject);

        expect(apiClient.put).toHaveBeenCalledWith(
            '/api/Appointments/123',
            requestObject,
        );
        expect(console.log).toHaveBeenCalledWith(mockError); 
    });

    // Test for getUserAppointments
    it('should fetch user appointments correctly', async () => {
        const response = await service.getUserAppointments();
        expect(apiClient.get).toHaveBeenCalledWith(
            `/api/Appointments/GetUserAppointments/${mockId}`,
        );
        expect(response).toEqual(mockData.data);
    });

    it('should handle errors in getUserAppointments', async () => {
        apiClient.get.mockRejectedValueOnce(mockError);
        await service.getUserAppointments();
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

    // Test for getTrainerAppointments
    it('should fetch trainer appointments correctly', async () => {
        const response = await service.getTrainerAppointments();
        expect(apiClient.get).toHaveBeenCalledWith(
            `/api/Appointments/GetTrainerAppointments/${mockId}`,
        );
        expect(response).toEqual(mockData.data);
    });

    it('should handle errors in getTrainerAppointments', async () => {
        apiClient.get.mockRejectedValueOnce(mockError);
        await service.getTrainerAppointments();
        expect(console.log).toHaveBeenCalledWith(mockError);
    });

});

const addHoursToDate = (date, hours) => {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}