import Bid from '../models/Bid.js';

export const getBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ organizationId: req.organizationId })
      .populate('tenderId', 'title closingDate');
      
    res.status(200).json(bids);
  } catch (error) {
    next(error);
  }
};

export const createBid = async (req, res, next) => {
  try {
    const { tenderId } = req.body;
    
    const bid = await Bid.create({
      organizationId: req.organizationId,
      tenderId
    });

    res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
};

export const updateBidStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const bid = await Bid.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.organizationId },
      { status },
      { new: true }
    );

    if (!bid) return res.status(404).json({ error: 'Bid not found' });

    res.status(200).json(bid);
  } catch (error) {
    next(error);
  }
};