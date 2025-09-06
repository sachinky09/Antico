import { supabase } from '../config/database.js';

export const getProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('status', ['listed', 'bidding'])
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: 'Failed to fetch products' });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, base_price, image_url } = req.body;

    if (!name || !description || !base_price || !image_url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([{
        name,
        description,
        base_price: parseFloat(base_price),
        image_url,
        status: 'listed'
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to create product' });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductInterests = async (req, res) => {
  try {
    const { id } = req.params;

    const { count, error } = await supabase
      .from('interests')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id);

    if (error) {
      return res.status(400).json({ error: 'Failed to fetch interests' });
    }

    res.json({ product_id: id, interest_count: count });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSoldProducts = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        bids!inner (
          bid_amount,
          users (name, email)
        )
      `)
      .eq('status', 'sold')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: 'Failed to fetch sold products' });
    }

    // Get the highest bid for each product
    const productsWithWinners = await Promise.all(
      products.map(async (product) => {
        const { data: highestBid, error: bidError } = await supabase
          .from('bids')
          .select(`
            bid_amount,
            users (name, email)
          `)
          .eq('product_id', product.id)
          .order('bid_amount', { ascending: false })
          .limit(1)
          .single();

        return {
          ...product,
          winning_bid: highestBid
        };
      })
    );

    res.json(productsWithWinners);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};