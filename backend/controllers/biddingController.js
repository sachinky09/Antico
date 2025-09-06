import { supabase } from '../config/database.js';

export const startBidding = async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // First, set any current bidding products back to listed
    await supabase
      .from('products')
      .update({ status: 'listed' })
      .eq('status', 'bidding');

    // Update product status to bidding
    const { data: product, error } = await supabase
      .from('products')
      .update({ status: 'bidding' })
      .eq('id', product_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to start bidding' });
    }

    res.json({ message: 'Bidding started successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { product_id, bid_amount } = req.body;
    const user_id = req.user.id;

    if (!product_id || !bid_amount) {
      return res.status(400).json({ error: 'Product ID and bid amount are required' });
    }

    // Check if product is in bidding status
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, base_price, status')
      .eq('id', product_id)
      .eq('status', 'bidding')
      .single();

    if (productError || !product) {
      return res.status(400).json({ error: 'Product not available for bidding' });
    }

    // Get current highest bid
    const { data: highestBid } = await supabase
      .from('bids')
      .select('bid_amount')
      .eq('product_id', product_id)
      .order('bid_amount', { ascending: false })
      .limit(1)
      .single();

    const currentHighest = highestBid ? highestBid.bid_amount : product.base_price;
    const bidAmount = parseFloat(bid_amount);

    if (bidAmount <= currentHighest) {
      return res.status(400).json({ 
        error: `Bid must be higher than current highest: $${currentHighest}` 
      });
    }

    // Place bid
    const { data: bid, error } = await supabase
      .from('bids')
      .insert([{
        product_id,
        user_id,
        bid_amount: bidAmount
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to place bid' });
    }

    res.status(201).json({ message: 'Bid placed successfully', bid });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentBidding = async (req, res) => {
  try {
    // Get current bidding product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'bidding')
      .single();

    if (productError || !product) {
      return res.json({ product: null, topBid: null });
    }

    // Get highest bid for the product
    const { data: topBid } = await supabase
      .from('bids')
      .select(`
        bid_amount,
        created_at,
        users (name)
      `)
      .eq('product_id', product.id)
      .order('bid_amount', { ascending: false })
      .limit(1)
      .single();

    res.json({ product, topBid });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const endBidding = async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Update product status to sold
    const { data: product, error } = await supabase
      .from('products')
      .update({ status: 'sold' })
      .eq('id', product_id)
      .eq('status', 'bidding')
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to end bidding' });
    }

    res.json({ message: 'Bidding ended successfully', product });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};