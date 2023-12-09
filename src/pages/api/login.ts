import { NextApiHandler } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient({ req, res })
  // const user = await supabase.auth.getSession();
  // if (user.data.session === null){
  //   return res.json({ message: 'unauthorized' })
  // }

  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email, password } = req.body;

  try {
    // Check if user exists in Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password });


    console.log(error);
    if (error) {
      // Provide specific feedback to the client based on the error
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Authentication successful
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler