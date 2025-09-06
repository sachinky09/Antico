import { supabase } from '../config/database.js';

export const markInterest = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Check if interest already exists
    const { data: existingInterest } = await supabase
      .from('interests')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .single();

    if (existingInterest) {
      return res.status(400).json({ error: 'Interest already marked' });
    }

    const { data: interest, error } = await supabase
      .from('interests')
      .insert([{
        user_id,
        product_id
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to mark interest' });
    }

    res.status(201).json({ message: 'Interest marked successfully', interest });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};