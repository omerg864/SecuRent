import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';


const createItem = asyncHandler(async (req, res) => {
    const { business, description, amount, price, currency } = req.body;

    if (!business || !description || !amount || !price || !currency) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const item = await Item.create({
        business,
        description,
        amount,
        price,
        currency,
    });

    res.status(201).json({
        success: true,
        item,
    });
});


const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find().populate('business');
    res.status(200).json({
        success: true,
        items,
    });
});


const getItemById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id).populate('business');

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    res.status(200).json({
        success: true,
        item,
    });
});


const updateItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { description, amount, price, currency } = req.body;
    
    const item = await Item.findById(id);
    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    item.description = description || item.description;
    item.amount = amount ?? item.amount;
    item.price = price ?? item.price;
    item.currency = currency || item.currency;
    
    await item.save();
    res.status(200).json({
        success: true,
        item,
    });
});


const deleteItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
        res.status(404);
        throw new Error('Item not found');
    }

    await item.remove();
    res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
    });
});

export { createItem, getItems, getItemById, updateItem, deleteItem };
