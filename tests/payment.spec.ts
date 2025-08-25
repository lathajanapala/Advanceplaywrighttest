import { test, expect, request } from '@playwright/test';
import * as paymentData from '../testdata/payment_testdata.json';

test.describe('Payment API Tests', () => {
    paymentData.testCases.forEach((testCase, index) => {
        test(`Verify payment process for test case ${index + 1}`, async ({}) => {
            // Extract test data from the JSON file
            const { cardNumber, expiryDate, cvv, amount } = testCase;

            // Create a new API request context
            const apiContext = await request.newContext();

            // Send a POST request to the payment API
            const response = await apiContext.post('https://example.com/api/payment', {
                data: {
                    cardNumber,
                    expiryDate,
                    cvv,
                    amount
                }
            });

            // Assert the response status and success message
            expect(response.status()).toBe(200);
            const responseBody = await response.json();
            expect(responseBody.message).toBe('Payment successful');
        });
    });
});