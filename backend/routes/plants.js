import express from 'express';
import Plant from '../models/Plant.js';
import { auth } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const plants = await Plant.find({ userId: req.userId });
  // Assign random sprite to plants that don't have one (for existing plants)
  for (const plant of plants) {
    if (!plant.spriteIndex) {
      plant.spriteIndex = Math.floor(Math.random() * 5) + 1;
      await plant.save();
    }
  }
  res.json(plants);
});

router.post('/', auth, async (req, res) => {
  // Randomly assign a sprite index (1-5) if not provided
  const spriteIndex = req.body.spriteIndex || Math.floor(Math.random() * 5) + 1;
  const plant = new Plant({ ...req.body, userId: req.userId, spriteIndex });
  await plant.save();
  res.json(plant);
});

router.get('/:id', auth, async (req, res) => {
  const plant = await Plant.findOne({ _id: req.params.id, userId: req.userId });
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  // Assign random sprite to plant if it doesn't have one (for existing plants)
  if (!plant.spriteIndex) {
    plant.spriteIndex = Math.floor(Math.random() * 5) + 1;
    await plant.save();
  }
  res.json(plant);
});

router.put('/:id', auth, async (req, res) => {
  const plant = await Plant.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json(plant);
});

router.delete('/:id', auth, async (req, res) => {
  const plant = await Plant.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!plant) return res.status(404).json({ message: 'Plant not found' });
  res.json({ message: 'Plant deleted' });
});

router.post('/:id/suggestions', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, userId: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    // Build context about the plant
    const plantContext = `Plant Name: ${plant.name}\nPlant Type: ${plant.type}\n`;
    const notesContext = plant.notes ? `Notes: ${plant.notes}\n` : '';
    const lastWateredContext = plant.lastWatered ? `Last Watered: ${new Date(plant.lastWatered).toLocaleDateString()}\n` : '';
    const lastFertilizedContext = plant.lastFertilized ? `Last Fertilized: ${new Date(plant.lastFertilized).toLocaleDateString()}\n` : '';

    const prompt = `You are a plant care expert. Based on the following plant information, provide a helpful care suggestion. Keep it concise (2-3 sentences) and actionable.

${plantContext}${notesContext}${lastWateredContext}${lastFertilizedContext}

Provide a specific care suggestion for this plant:`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestionText = response.text();

    // Add suggestion to plant
    plant.suggestions.push({ text: suggestionText });
    await plant.save();

    res.json({ suggestion: suggestionText, plant });
  } catch (error) {
    console.error('Error getting suggestion:', error);
    res.status(500).json({ message: 'Failed to get suggestion. Please check your API key.' });
  }
});

router.delete('/:id/suggestions/:suggestionId', auth, async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, userId: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    plant.suggestions = plant.suggestions.filter(
      s => s._id.toString() !== req.params.suggestionId
    );
    await plant.save();

    res.json({ message: 'Suggestion deleted', plant });
  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ message: 'Failed to delete suggestion' });
  }
});

router.post('/:id/chat', auth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const plant = await Plant.findOne({ _id: req.params.id, userId: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Gemini API key not configured' });
    }

    // Build context about the plant
    const plantContext = `Plant Name: ${plant.name}\nPlant Type: ${plant.type}\n`;
    const notesContext = plant.notes ? `Notes: ${plant.notes}\n` : '';
    const lastWateredContext = plant.lastWatered ? `Last Watered: ${new Date(plant.lastWatered).toLocaleDateString()}\n` : '';
    const lastFertilizedContext = plant.lastFertilized ? `Last Fertilized: ${new Date(plant.lastFertilized).toLocaleDateString()}\n` : '';

    const prompt = `You are a helpful plant care assistant. The user is asking about their plant. Use the following plant information to provide a helpful and accurate response.

Plant Information:
${plantContext}${notesContext}${lastWateredContext}${lastFertilizedContext}

User's Question: ${message.trim()}

Provide a helpful response about this plant:`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ message: 'Failed to get response. Please check your API key.' });
  }
});

export default router;

