const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const GeminiAIController = require('../controllers/geminiAIController');
const gemini = require('../helpers/geminiAI');

jest.mock('../helpers/geminiAI');

const app = express();
app.use(bodyParser.json());
app.post('/askAI', GeminiAIController.askAI);

describe('GeminiAIController', () => {
    it('should return 201 and data when gemini resolves', async () => {
        const mockData = { response: 'AI response' };
        gemini.mockResolvedValue(mockData);

        const response = await request(app)
            .post('/askAI')
            .send({ promptUser: 'Hello AI' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockData);
    });

    it('should call next with error when gemini rejects', async () => {
        const mockError = new Error('Something went wrong');
        gemini.mockRejectedValue(mockError);

        const next = jest.fn();

        await GeminiAIController.askAI(
            { body: { promptUser: 'Hello AI' } },
            { status: jest.fn().mockReturnThis(), json: jest.fn() },
            next
        );

        expect(next).toHaveBeenCalledWith(mockError);
    });
});