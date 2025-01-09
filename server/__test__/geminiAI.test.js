const request = require('supertest');
const app = require('../app'); // Adjust the path to your app
const gemini = require('../helpers/geminiAI');
const { GoogleGenerativeAI } = require("@google/generative-ai");

describe('GeminiAI API', () => {
    it('should respond with a 200 status code for GET /endpoint', async () => {
        const response = await request(app).get('/endpoint');
        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 404 status code for GET /nonexistent', async () => {
        const response = await request(app).get('/nonexistent');
        expect(response.statusCode).toBe(404);
    });

    it('should create a new resource with POST /endpoint', async () => {
        const newResource = { name: 'Test Resource' };
        const response = await request(app)
            .post('/endpoint')
            .send(newResource)
            .set('Accept', 'application/json');
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    jest.mock("@google/generative-ai");

    describe('gemini', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            process.env.GOOGLE_AI_API_KEY = 'test-api-key';
        });

        it('should generate content with a user prompt', async () => {
            const mockGenerateContent = jest.fn().mockResolvedValue({
                response: {
                    text: jest.fn().mockResolvedValue('Generated content with user prompt')
                }
            });

            GoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: () => ({
                    generateContent: mockGenerateContent
                })
            }));

            const result = await gemini('Tell me about Pikachu');
            expect(result).toBe('Generated content with user prompt');
            expect(mockGenerateContent).toHaveBeenCalledWith('Welcome to the world of Pokemon Tell me about Pikachu');
        });

        it('should generate content without a user prompt', async () => {
            const mockGenerateContent = jest.fn().mockResolvedValue({
                response: {
                    text: jest.fn().mockResolvedValue('Generated content without user prompt')
                }
            });

            GoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: () => ({
                    generateContent: mockGenerateContent
                })
            }));

            const result = await gemini();
            expect(result).toBe('Generated content without user prompt');
            expect(mockGenerateContent).toHaveBeenCalledWith('Welcome to the world of Pokemon all about pokemon');
        });

        it('should throw an error if content generation fails', async () => {
            const mockGenerateContent = jest.fn().mockRejectedValue(new Error('Generation failed'));

            GoogleGenerativeAI.mockImplementation(() => ({
                getGenerativeModel: () => ({
                    generateContent: mockGenerateContent
                })
            }));

            await expect(gemini('Tell me about Pikachu')).rejects.toThrow('Error generating welcome pokemon.');
            expect(mockGenerateContent).toHaveBeenCalledWith('Welcome to the world of Pokemon Tell me about Pikachu');
        });
    });
});