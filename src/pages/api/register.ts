import { NextApiHandler } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const handler: NextApiHandler = async (req, res) => {

  const supabase = createPagesServerClient({ req, res })
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const { data, error } = await supabase
      .from('member')
      .select('*')
      .eq('email', email);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length !== 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // If the user does not exist, proceed with registration
    const { error: registrationError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `/api/auth/`,
      },
    });

    if (registrationError) {
      return res.status(500).json({ error: registrationError.message });
    }

    // Registration successful
    return res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default handler