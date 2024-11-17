import { jest } from '@jest/globals'; // Jest globals for mocking
import { shopifyApi } from '@shopify/shopify-api'; // Import the actual library
import ShopifyService from "../../src/services/shopify.service";
import { Readable } from 'stream';

// Mock shopifyApi to bypass getting original api keys
jest.mock('@shopify/shopify-api', () => ({
   shopifyApi: jest.fn(() => ({
       dummyClient: true, // A fake client object
   })),
}));
//put same time of tasks in inside describe
describe('ShopifyService',() => {
    let shopifyService;

    //Before initialize the shopifyService instance
     beforeAll(() => {
     shopifyService = new ShopifyService();
     });

     test('streamToBuffer converts stream to buffer',async () => {
        const testData = 'Hello World';
        const mockStream = Readable.from([Buffer.from(testData)]);


        //Call the function with the mock stream
        const buffer = await shopifyService.streamToBuffer(mockStream);
        expect(buffer.toString()).toBe(testData);

     })
});